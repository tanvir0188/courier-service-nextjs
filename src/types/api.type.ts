export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: ApiMeta;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  name?: string;
  message: string;
  error?: {
    statusCode?: number;
    [key: string]: unknown;
  };
  stack?: string;
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;
