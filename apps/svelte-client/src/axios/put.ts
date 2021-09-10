import { apiRequest } from './apiRequest';

export function put(url: string, payload: object = {}, cancelToken = undefined): Promise<void> {
    return apiRequest('put', url, payload, cancelToken);
}
  