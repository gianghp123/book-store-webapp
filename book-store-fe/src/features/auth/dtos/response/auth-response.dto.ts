// User interface for the response
export interface UserResponse {
  id: string;
  full_name: string;
  email: string;
  phoneNumber?: string;
  role: string; // Role enum
  createdAt: string; // date
  updatedAt: string; // date
}

// Response for register and login
export interface AuthResponse {
  access_token: string;
  user: UserResponse;
}

// Response for reset password
export interface ResetPasswordResponse {
  message: string;
}