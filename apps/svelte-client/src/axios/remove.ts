import { apiRequest } from './apiRequest';

export function remove(url: string, cancelToken = undefined): Promise<void> {
    console.log('delete method')
    return apiRequest('delete', url, undefined, cancelToken);
}
  