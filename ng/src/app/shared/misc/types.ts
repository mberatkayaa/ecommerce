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
  type: "info" | "success" | "warning" | "error" | "loading";
  title: string;
  description: string;
  position?: "middle" | "side";
  payload?: any;
  timeout?: number;
}
