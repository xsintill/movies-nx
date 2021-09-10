import { apiRequest } from './apiRequest';

export function post(url: string, payload: object = {}, cancelToken = undefined): Promise<void> {
    return apiRequest('post', url, payload, cancelToken);
}
  