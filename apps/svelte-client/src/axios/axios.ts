import axios from 'axios/dist/axios';

import type { AxiosRequestConfig, AxiosStatic } from 'axios';
import { getCache, invalidateGetCache, invalidateStaleGetCacheData, writeToCache } from './cache';

export const ax: AxiosStatic = axios.create();

function logIf(config: AxiosRequestConfig, message: string): void {
 (config.url ==='api/film/latest?search=&pageIndex=0') ?
     console.log(`intercepter: ${message}`):
     undefined;
}

ax.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        if (getCache === null || getCache.length === 0)  return config
        if (config.method === 'put' ||
        config.method === 'post' || 
        config.method === 'delete' 
        ) {
            invalidateGetCache('api/film');
        }
        if (config.method === 'get') {
            const index = getCache.findIndex((item) => item.url.trim().toLowerCase() === config.url.trim().toLowerCase());
            if (index !== -1) {
                const response = getCache[index].response;
                config.adapter = () => Promise.resolve(response);
            }
            return config;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
)
ax.interceptors.response.use(
    (res) => {
        if (res.config.method === 'get') {
            if (!getCache) return res;
            const index = getCache.findIndex((item) => item.url === res.config.url);
            if (index === -1) {
                const invalidAfterDate = new Date();
                invalidAfterDate.setHours(invalidAfterDate.getHours() + 4);
                writeToCache({
                    url: res.config.url,
                    response: res,
                    invalidAfter: invalidAfterDate
                })
                
                invalidateStaleGetCacheData();
                return res;
            }
            invalidateStaleGetCacheData();
            return res;
        }
        invalidateStaleGetCacheData();
        return res;
    },
    (error) => {
        return Promise.reject(error);
    },
)
