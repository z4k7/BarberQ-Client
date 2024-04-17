declare module 'angular-cache' {
  export class CacheFactory {
    createCache(cacheId: string, options?: any): CacheService;
  }

  export class CacheService {
    get(key: string): any;
    put(key: string, value: any, options?: any): void;
    remove(key: string): void;
    removeAll(): void;
  }

  export function CacheFactory(cacheId: string, options?: any): CacheService;
}
