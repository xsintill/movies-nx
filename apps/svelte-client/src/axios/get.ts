import { apiRequest } from './apiRequest';

import type { FilmResponse } from './FilmResponse.type';

export default function get<Result>(url: string, request: unknown = {}): Promise<FilmResponse<Result>> {
  return apiRequest<Result>('get', url, request);
}
