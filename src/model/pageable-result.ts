export interface PageableResult<T = unknown> {
  content: T[];
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}
