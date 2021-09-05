import type { AxiosResponse } from "axios";

export interface GetCacheItem {
    url: string;
    invalidAfter: Date;
    response: AxiosResponse<any>;
}
