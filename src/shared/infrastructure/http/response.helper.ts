export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: any;
}

export const successResponse = <T>(data: T, message?: string): SuccessResponse<T> => {
  return {
    success: true,
    data,
    ...(message && { message }),
  };
};

export const errorResponse = (error: string, message: string, details?: any): ErrorResponse => {
  return {
    success: false,
    error,
    message,
    ...(details && { details }),
  };
};
