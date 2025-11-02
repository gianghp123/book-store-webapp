import { LoginDto } from "@/features/auth/dtos/request/login.dto";
import { RegisterDto } from "@/features/auth/dtos/request/register.dto";
import { Role } from "@/lib/constants/enums";
import { AuthProvider } from "@refinedev/core";
import {
  checkAuthAction,
  getIdentityAction,
  loginAction,
  logoutAction,
  registerAction,
} from "../features/auth/actions/auth.actions";

export const authProvider: AuthProvider = {
  register: async (params: RegisterDto) => {
    const { success } = await registerAction(params);

    if (!success) {
      throw new Error("Register failed");
    }

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  login: async (params: LoginDto) => {
    const { success, data } = await loginAction(params);

    if (!success || !data) {
      throw new Error("Đăng nhập thất bại");
    }

    return {
      success: true,
      redirectTo: "/",
    };
  },

  logout: async () => {
    await logoutAction();
    return { success: true, redirectTo: "/" };
  },

  check: async (params?: { role?: Role }) => {
    const { authenticated, redirectTo } = await checkAuthAction(params);
    return { authenticated, redirectTo };
  },

  getIdentity: async () => {
    const user = await getIdentityAction();
    return user;
  },

  onError: async (error) => {
    console.error("Auth Provider Error:", error);
    return { error };
  },
};
