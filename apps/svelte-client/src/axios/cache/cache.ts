import type { GetCacheItem } from "./cache.type";

export let getCache: GetCacheItem[] = [];

export function invalidateGetCache(urlStartsWith?: string): void {
    if (urlStartsWith) console.log('invalidate for:', urlStartsWith)
    const prevLength = getCache.length;
    getCache = [...getCache.filter((item) => !item.url.startsWith(urlStartsWith))];
    const postLength = getCache.length;
    prevLength !== postLength && window.localStorage.setItem('getCache', JSON.stringify(getCache));
}

export function invalidateStaleGetCacheData(): void {
    const now = new Date();
    const prevLength = getCache.length;
    getCache = [...getCache.filter((item) => item.invalidAfter > now)];
    const postLength = getCache.length;
    prevLength !== postLength && window.localStorage.setItem('getCache', JSON.stringify(getCache));
}

export function writeToCache(item: GetCacheItem): void {
    getCache.push(item);
    window.localStorage.setItem('getCache',JSON.stringify(getCache));
}

export function initGetCache(callback:Function): void {    
    getCache = JSON.parse(window.localStorage.getItem('getCache'));
    callback();
}