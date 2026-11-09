export interface User {
  id: string;
  name: string;
  email: string;
  locale: 'id' | 'en';
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  name: string;
  email: string;
  locale?: 'id' | 'en';
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}
