import { apiRequest } from './apiRequest';

export function put(url: string, payload: object = {}): Promise<void> {
    return apiRequest('put', url, payload);
}
  