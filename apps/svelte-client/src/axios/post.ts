import { apiRequest } from './apiRequest';

export function post(url: string, payload: object = {}): Promise<void> {
    return apiRequest('post', url, payload);
}
  