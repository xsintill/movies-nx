import { apiRequest } from './apiRequest';

export function remove(url: string): Promise<void> {
    console.log('delete method')
    return apiRequest('delete', url);
}
  