// src/provider/auth-provider.ts
import { AuthProvider } from "@refinedev/core";
import { apiFetch } from "@/lib/api-fetch";
import { setAuthToken, getAuthToken, removeAuthToken } from "@/lib/cookie/cookie";
import { RegisterDto } from "@/features/auth/dtos/request/register.dto";
import { LoginDto } from "@/features/auth/dtos/request/login.dto";
import { AuthResponse } from "@/features/auth/dtos/response/auth-response.dto";

export const authProvider: AuthProvider = {
  // THÊM PHƯƠNG THỨC REGISTER NÀY VÀO
  register: async (params: RegisterDto) => {
    try {
      const { data, success, message } = await apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(params),
      });

      // Kiểm tra lỗi hoặc token (phải là snake_case)
      if (!success || !data?.access_token) {
        throw new Error(message || "Đăng ký thất bại, không nhận được token.");
      }

      // 2. API thành công, lưu token
      setAuthToken(data.access_token);

      // 3. Báo cho Refine biết đã thành công và chuyển hướng
      return {
        success: true,
        redirectTo: "/", // Chuyển hướng về trang chủ
      };
    } catch (error: any) {
      return {
        success: false,
        error: new Error(error.message || "Lỗi đăng ký không xác định"),
      };
    }
  },

  // THÊM PHƯƠNG THỨC LOGIN (ĐỂ HOÀN THIỆN)
  login: async (params: LoginDto) => {
     try {
      const { data, success, message } = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(params),
      });

      if (!success || !data?.access_token) {
        throw new Error(message || "Đăng nhập thất bại, không nhận được token.");
      }
      
      setAuthToken(data.access_token);
      
      return {
        success: true,
        redirectTo: "/admin/dashboard", // Chuyển hướng đến trang admin
      };
    } catch (error: any) {
      return {
        success: false,
        error: new Error(error.message || "Lỗi đăng nhập không xác định"),
      };
    }
  },

  // CÁC PHƯƠNG THỨC CẦN THIẾT KHÁC (ĐỂ TRỐNG)
  logout: async () => {
    removeAuthToken();
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    const token = getAuthToken();
    if (token) {
      return { authenticated: true };
    }
    return { authenticated: false, redirectTo: "/login" };
  },

  getIdentity: async () => {
    // Tạm thời trả về null, bạn có thể gọi API /me tại đây
    const token = getAuthToken();
    if (token) {
      return { id: 1, name: "User" }; // Lấy thông tin user
    }
    return null;
  },

  onError: async (error) => {
    console.error("Auth Provider Error:", error);
    return { error };
  },
};