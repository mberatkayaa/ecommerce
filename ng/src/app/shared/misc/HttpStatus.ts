export class HttpStatus {
  loading: boolean = false;
  done: boolean = false;
  error: boolean = false;
  get completed(): boolean {
    return this.done || this.error;
  }
  get text(): "idle" | "loading" | "done" | "error" {
    if (this.loading) return "loading";
  }
  message: string = "";

  set(prop: "loading" | "done" | "error", value: boolean);
  set(prop: "message", value: string);
  set(prop: "loading" | "done" | "error" | "message", value: boolean | string): HttpStatus {
    this[<string>prop] = value;
    return this;
  }
}
