import { apiRequest } from './apiRequest';

export default function get<Result>(url: string, request: unknown = {}): Promise<Result> {
  return apiRequest<Result>('get', url, request);
}
