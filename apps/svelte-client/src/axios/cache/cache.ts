import type { GetCacheItem } from "./cache.type";

export let getCache: GetCacheItem[] = [];

export function invalidateGetCache(urlStartsWith?: string): void {
    getCache = [...getCache.filter((item) => !item.url.startsWith(urlStartsWith))];
}