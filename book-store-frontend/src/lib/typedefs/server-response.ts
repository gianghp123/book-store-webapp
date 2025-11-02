export type ServerResponseModel<T = any> = {
  data?: T;
  message?: string;
  statusCode?: number;
  success: boolean;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
