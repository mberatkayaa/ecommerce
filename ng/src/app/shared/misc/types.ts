export interface HttpResult<T> {
  ok: boolean;
  error: boolean;
  message: string;
  body: T;
  source: string;
}

export interface PaginatedHttpResult<T>
  extends HttpResult<{ docs: Array<T>; page: number; totalPages: number; totalDocs: number }> {}

export interface INotification {
  type: "error" | "notification";
  title: string;
  description: string;
  payload?: any;
  time?: number;
}
