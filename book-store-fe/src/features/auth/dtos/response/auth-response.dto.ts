// User interface for the response
export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: string; // Role enum
  createdAt: string; // date
  updatedAt: string; // date
}

// Response for register and login
export interface AuthResponse {
  accessToken: string;
  user: UserResponse;
}

// Response for reset password
export interface ResetPasswordResponse {
  message: string;
}