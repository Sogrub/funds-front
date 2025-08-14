import { GenericResponse } from "@shared/interfaces/generic.interfaces";
import axios, { AxiosError, Method, RawAxiosRequestHeaders } from "axios";

export interface HttpAdapterProps<P> {
  url?: string;
  method?: Method;
  headers?: RawAxiosRequestHeaders;
  baseURL?: string;
  data?: unknown;
  params?: P;
  map?: <R = unknown>(response: unknown) => R;
}

export interface HttpAdapterResponse<R = unknown, E = GenericResponse> {
  data: R | null;
  error: E | null;
}

export const httpAdapter = async <R = unknown, E = GenericResponse, P = Record<string, string>>(
  props: HttpAdapterProps<P>,
): Promise<HttpAdapterResponse<R, E>> => {
  const { baseURL, headers, map, method = "GET", ...rest } = props;
  const newBaseURL = baseURL ?? process.env.NEXT_PUBLIC_SERVER;
  const newHeaders: RawAxiosRequestHeaders = { ...props.headers };

  const baseAxiosRequest = axios.create({
    baseURL: newBaseURL,
    headers: newHeaders,
  });

  try {
    const response = await baseAxiosRequest<R>({ ...rest, method });
    let responseData = response.data;
    if (map) responseData = map<R>(responseData);
    return { data: responseData, error: null };
  } catch (err) {
    const axiosError = err as AxiosError<E>;
    const responseData = axiosError.response?.data;
    return { data: null, error: responseData ?? null };
  }
};