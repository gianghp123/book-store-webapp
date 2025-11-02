import { LoginDto } from "@/features/auth/dtos/request/login.dto";
import { RegisterDto } from "@/features/auth/dtos/request/register.dto";
import { AuthResponse } from "@/features/auth/dtos/response/auth-response.dto";
import { UserResponse } from "@/features/users/dtos/response/user-response.dto";
import { apiFetch } from "@/lib/api-fetch";
import { Role } from "@/lib/constants/enums";
import {
  getAuthTokenServer,
  getUserServer,
  removeAuthTokenServer,
  setAuthTokenServer,
} from "@/lib/cookie/cookie-server";

const register = async (params: RegisterDto) => {
  const response = await apiFetch<UserResponse>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(params),
    }
  );

  return response;
};

const login = async (params: LoginDto) => {
  const response = await apiFetch<AuthResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(params),
    }
  );

  if (!response.success || !response.data?.accessToken) {
    throw new Error(response.message ||"Failed to login, please try again");
  }

  await setAuthTokenServer(response.data);

  return response;
};

const logout = async () => {
  await removeAuthTokenServer();
};

const check = async (params?: { role?: Role }) => {
  const token = await getAuthTokenServer();
  if (token) {
    const user = await getUserServer();
    if (!user) {
      return { authenticated: false, redirectTo: "/" };
    }
    if (params && params.role && user.role !== params.role) {
      return { authenticated: false, redirectTo: "/" };
    }
    return { authenticated: true };
  }
  return { authenticated: false, redirectTo: "/" };
};

const getIdentity = async () => {
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
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
  }
  return null;
};


export const authService = {
  register,
  login,
  logout,
  check,
  getIdentity,
};