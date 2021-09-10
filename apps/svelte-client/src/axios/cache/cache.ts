import type { GetCacheItem } from "./cache.type";

export let getCache: GetCacheItem[] = [];

export function invalidateGetCache(urlStartsWith?: string): void {
    getCache = [...getCache.filter((item) => !item.url.startsWith(urlStartsWith))];
}

export function invalidateStaleGetCacheData(): void {
    const now = new Date();
    getCache = [...getCache.filter((item) => item.invalidAfter > now)];
}
export function writeToCache(item: GetCacheItem): void {
    getCache.push(item);
}