export interface HttpResult<T> {
  ok: boolean;
  error: boolean;
  message: string;
  body: T;
  source: string;
}

export interface PaginatedHttpResult<T>
  extends HttpResult<{ docs: Array<T>; page: number; totalPages: number; totalDocs: number }> {}
