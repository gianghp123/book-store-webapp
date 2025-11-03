import { UserResponse } from "@/features/users/dtos/response/user-response.dto";

// Response for register and login
export interface AuthResponse {
  accessToken: string;
  user: UserResponse;
}

// Response for reset password
export interface ResetPasswordResponse {
  message: string;
}