/**
 * Any changes here should be done on the client side also
 */

export interface Paging {
  pageIndex: number;
  pageSize: number;
  filmsToAddUntilCompletion: number;
  seenAfterCrashCount: number;
  totalDbCount: number;
  totalCount: number;
  searchCount: number;
  pageCount: number;
}