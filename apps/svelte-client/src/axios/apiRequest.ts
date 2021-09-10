import type { AxiosError, AxiosResponse, Method } from 'axios';

import { ax } from './axios';

export function apiRequest<Result>(method: Method, url: string, request: unknown = {}, cancelToken = undefined): Promise<Result> {
  const headers = {
    authorization: ''
  };
  //using the axios instance to perform the request that received from each http method
  return ax({
    method,
    url,
    data: request,
    headers,
    withCredentials: false,
    cancelToken
  })
    .then((res: AxiosResponse<Result>) => Promise.resolve(res.data))
    .catch((err: AxiosError) => Promise.reject(err));
}
