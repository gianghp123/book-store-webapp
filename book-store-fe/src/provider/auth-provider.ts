// src/provider/auth-provider.ts
import { LoginDto } from "@/features/auth/dtos/request/login.dto";
import { RegisterDto } from "@/features/auth/dtos/request/register.dto";
import { AuthResponse } from "@/features/auth/dtos/response/auth-response.dto";
import { UserResponse } from "@/features/users/dtos/response/user-response.dto";
import { apiFetch } from "@/lib/api-fetch";
import {
  getAuthTokenServer,
  getUserServer,
  removeAuthTokenServer,
  setAuthTokenServer,
} from "@/lib/cookie/cookie-server";
import { AuthProvider } from "@refinedev/core";

export const authProvider: AuthProvider = {
  // THÊM PHƯƠNG THỨC REGISTER NÀY VÀO
  register: async (params: RegisterDto) => {
      const { data, success, message } = await apiFetch<UserResponse>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify(params),
        }
      );

      if (!success) {
        throw new Error(message || "Register failed");
      }

      return {
        success: true,
        redirectTo: "/login", // Chuyển hướng về trang login
      };
  },

  // THÊM PHƯƠNG THỨC LOGIN (ĐỂ HOÀN THIỆN)
  login: async (params: LoginDto) => {
      const { data, success, message } = await apiFetch<AuthResponse>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(params),
        }
      );

      if (!success || !data?.accessToken) {
        throw new Error(
          message || "Đăng nhập thất bại, không nhận được token."
        );
      }

      await setAuthTokenServer(data);

      return {
        success: true,
        redirectTo: "/",
      };
  },

  // CÁC PHƯƠNG THỨC CẦN THIẾT KHÁC (ĐỂ TRỐNG)
  logout: async () => {
    await removeAuthTokenServer();
    return { success: true, redirectTo: "/" };
  },

  check: async () => {
    const token = await getAuthTokenServer();
    if (token) {
      const user = await getUserServer();
      if (!user) {
        return { authenticated: false, redirectTo: "/" };
      }
      return { authenticated: true };
    }
    return { authenticated: false, redirectTo: "/" };
  },

  getIdentity: async () => {
    // Tạm thời trả về null, bạn có thể gọi API /me tại đây
    const token = await getAuthTokenServer();
    if (token) {
      const user = await getUserServer();
      if (!user) {
        return null;
      }
      return {
        id: user.id,
        name: user.fullName,
        role: user.role,
      };
    }
    return null;
  },

  onError: async (error) => {
    console.error("Auth Provider Error:", error);
    return { error };
  },
};
