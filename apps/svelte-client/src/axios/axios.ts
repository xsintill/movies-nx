import axios from 'axios/dist/axios';

import type { AxiosRequestConfig, AxiosStatic } from 'axios';
import { getCache, invalidateGetCache } from './cache';

export const ax: AxiosStatic = axios.create();

ax.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        if (config.method === 'put' ||
            config.method === 'post' || 
            config.method === 'delete' 
            ) {
            invalidateGetCache('api/film');
        }
        if (config.method === 'get') {
            const index = getCache.findIndex((item) =>item.url === config.url);
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
            const index = getCache.findIndex((item) => item.url === res.config.url);
            if (index === -1) {
                const now = new Date()
                now.setHours(now.getHours() + 4)
                getCache.push({
                    url: res.config.url,
                    response: res,
                    invalidAfter: now
                });
                return res;
            }
            return res;
        }
        return res;
    },
    (error) => {
        return Promise.reject(error);
    },
)
