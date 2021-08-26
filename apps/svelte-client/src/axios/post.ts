import { apiRequest } from './apiRequest';

export function post(url: string, payload: unknown = {}): Promise<void> {
    console.log('post method')
    return apiRequest('post', url, payload);
}
  