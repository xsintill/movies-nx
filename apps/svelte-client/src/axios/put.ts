import { apiRequest } from './apiRequest';

export function put(url: string, payload: unknown = {}): Promise<void> {
    console.log('put method')
    return apiRequest('put', url, payload);
}
  