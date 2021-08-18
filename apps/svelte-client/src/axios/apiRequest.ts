import type { AxiosError, AxiosResponse, Method } from 'axios';

import { ax } from './axios';
import type { FilmResponse } from './FilmResponse.type';

export function apiRequest<Result>(method: Method, url: string, request: unknown = {}): Promise<FilmResponse<Result>> {
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
    .then((res: AxiosResponse<FilmResponse<Result>>) => Promise.resolve(res.data))
    .catch((err: AxiosError) => Promise.reject(err));
}
