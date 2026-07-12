export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  errors: any[];
}

export function successResponse<T>(data: T, message = 'Success'): ApiResponse<T> {
  return { success: true, message, data, errors: [] };
}

export function errorResponse(message: string, errors: any[] = []): ApiResponse<null> {
  return { success: false, message, data: null, errors };
}
