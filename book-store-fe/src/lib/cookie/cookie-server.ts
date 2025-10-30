"use server";
import { AuthResponse } from "@/features/auth/dtos/response/auth-response.dto";
import { UserResponse } from "@/features/users/dtos/response/user-response.dto";
import { cookies } from "next/headers";

export async function getAuthTokenServer(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");
  return accessToken?.value || null;
}

export async function getUserServer(): Promise<UserResponse | null> {
  const cookieStore = await cookies();
  const user = cookieStore.get("user");
  return user?.value ? JSON.parse(user.value) : null;
}

export async function setAuthTokenServer(loginResponse: AuthResponse) {
  const cookieStore = await cookies();

  cookieStore.set("user", JSON.stringify(loginResponse.user), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set("access_token", loginResponse.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function removeAuthTokenServer() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("user");
}
