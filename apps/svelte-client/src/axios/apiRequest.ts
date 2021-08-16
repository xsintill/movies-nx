import type { AxiosError, AxiosResponse, Method } from 'axios';
import { ax } from './axios';

export function apiRequest<Result>(method: Method, url: string, request: unknown = {}): Promise<Result> {
  const headers = {
    authorization: ''
  };
  //using the axios instance to perform the request that received from each http method
  return ax({
    method,
    url,
    data: request,
    headers,
    withCredentials: false
  })
    .then((res: AxiosResponse<{ results: Result }>) => Promise.resolve(res.data.results))
    .catch((err: AxiosError) => Promise.reject(err));
}
