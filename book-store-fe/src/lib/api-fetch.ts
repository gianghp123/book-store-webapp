import { getAuthTokenServer } from "./cookie/cookie-server";
import { ServerResponseModel } from "./typedefs/server-response";
import { keysToCamel, keysToSnake } from "./utils";

type ApiFetchOptions = {
  baseUrl?: string;
  withCredentials?: boolean;
  transformCase?: boolean;
  query?: Record<string, any>; // 👈 Add query parameter support
} & RequestInit;

export async function apiFetch<T = any>(
  url: string,
  options?: ApiFetchOptions
): Promise<ServerResponseModel<T>> {
  try {
    const {
      withCredentials = false,
      transformCase = true,
      baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || '',
      query,
      ...fetchOptions
    } = options || {};

    const headers: Record<string, any> = {
      ...fetchOptions?.headers,
      apikey: process.env.API_KEY || "",
    };

    // 🔐 Attach token if required
    if (withCredentials) {
      const accessToken = await getAuthTokenServer();
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
      else
        return {
          success: false,
          statusCode: 401,
          message: "Unauthorized",
        };
    }

    headers["Content-Type"] = "application/json";
    headers["Accept"] = "application/json";

    // 🧩 Transform query to snake_case
    let queryString = "";
    if (query && Object.keys(query).length > 0) {
      const snakeQuery = transformCase ? keysToSnake(query) : query;
      const searchParams = new URLSearchParams();
      Object.entries(snakeQuery).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      queryString = `?${searchParams.toString()}`;
    }

    const fullUrl = `${baseUrl}${url}${queryString}`;

    // 🧠 Transform outgoing body to snake_case
    if (fetchOptions.body && transformCase) {
      try {
        const parsed = JSON.parse(fetchOptions.body as string);
        fetchOptions.body = JSON.stringify(keysToSnake(parsed));
      } catch (_) {}
    }

    const response = await fetch(fullUrl, { ...fetchOptions, headers });

    if (!response.ok) {
      let message = "Unknown error";
      try {
        const errorData = await response.json();
        message = errorData.message || message;
      } catch (_) {}
      return { success: false, statusCode: response.status, message };
    }

    // ✅ Transform response to camelCase
    const data = await response.json();
    const transformed = transformCase ? keysToCamel(data) : data;

    return {
      success: true,
      statusCode: response.status,
      data: transformed.data ? (transformed.data as T) : (transformed as T),
      pagination: transformed.pagination,
    };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      statusCode: 500,
      message: error.message || "Unknown error",
    };
  }
}
