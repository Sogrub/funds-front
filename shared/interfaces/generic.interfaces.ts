export interface GenericResponse<T = unknown> {
  status: number;
  statusCode: number;
  message: string;
  data: T
}