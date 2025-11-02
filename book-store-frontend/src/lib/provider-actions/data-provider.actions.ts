// lib/actions/data-provider.actions.ts
"use server";

import { apiFetch } from "@/lib/api-fetch";
import { CrudFilter } from "@refinedev/core";

// ✅ Add generic constraints to match Refine's expectations
type GetOneParams = {
  id: string | number;
  resource: string;
  meta?: Record<string, any>;
};

type CreateParams<TVariables = Record<string, any>> = {
  resource: string;
  variables: TVariables; // ✅ Generic type
  meta?: Record<string, any>;
};

type UpdateParams<TVariables = Record<string, any>> = {
  id: string | number;
  resource: string;
  variables: TVariables; // ✅ Generic type
  meta?: Record<string, any>;
};

type DeleteOneParams = {
  id: string | number;
  resource: string;
  meta?: Record<string, any>;
};

type GetListParams = {
  resource: string;
  pagination?: {
    current?: number;
    pageSize?: number;
    mode?: "server" | "client" | "off";
  };
  sorters?: Array<{
    field: string;
    order: "asc" | "desc";
  }>;
  filters?: CrudFilter[];
  meta?: Record<string, any>;
};

// ✅ Server Actions with generic parameters
export async function getOneAction({ id, resource }: GetOneParams) {
  const { data } = await apiFetch(`/${resource}/${id}`, {
    withCredentials: true,
  });
  return { data };
}

export async function createAction<TVariables = Record<string, any>>({
  resource,
  variables,
}: CreateParams<TVariables>) {
  const { data, success, message } = await apiFetch(`/${resource}`, {
    method: "POST",
    body: JSON.stringify(variables),
    withCredentials: true,
  });

  if (!success) {
    throw new Error(message || "Tạo mới thất bại");
  }

  return { data };
}

export async function updateAction<TVariables = Record<string, any>>({
  id,
  resource,
  variables,
}: UpdateParams<TVariables>) {
  const { data, success, message } = await apiFetch(`/${resource}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(variables),
    withCredentials: true,
  });

  if (!success) {
    throw new Error(message || "Cập nhật thất bại");
  }

  return { data };
}

export async function deleteOneAction<TData = any>({
  id,
  resource,
}: {
  id: string | number;
  resource: string;
  meta?: any;
}): Promise<{ data: TData }> {
  const { success, message, data } = await apiFetch(`/${resource}/${id}`, {
    method: "DELETE",
    withCredentials: true,
  });

  if (!success) {
    throw new Error(message || "Xóa thất bại");
  }

  return { data: (data || { id }) as TData };
}

export async function getListAction({
  resource,
  pagination,
  sorters,
  filters,
}: GetListParams) {
  const { current = 1, pageSize = 10 } = pagination ?? {};
  const sort = sorters?.[0];

  const response = await apiFetch(`/${resource}`, {
    query: {
      page: current,
      limit: pageSize,
      sortBy: sort?.field,
      sortOrder: sort?.order,
      ...(filters && { filters: JSON.stringify(filters) }),
    },
    withCredentials: true,
  });

  if (!response.success) {
    console.error(`Failed to fetch ${resource}:`, response.message);
    throw new Error(response.message || `Failed to fetch ${resource}`);
  }

  return {
    data: response.data || [],
    total: response.pagination?.total || response.data?.length || 0,
  };
}
