export interface ApiResponse<T> {
    message: string;
    code: number;
    data?: T;
  }

export function createApiResponse<T> (
  message: string,
  code: number,
  data?: T
): ApiResponse<T> {
  return { message, code, data }
}
