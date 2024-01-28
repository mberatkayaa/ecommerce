export class HttpStatus {
  loading: boolean = false;
  done: boolean = false;
  error: boolean = false;

  get completed(): boolean {
    return this.done || this.error;
  }

  get text(): "idle" | "loading" | "done" | "error" {
    if (this.loading) return "loading";
    if (this.done) return "done";
    if (this.error) return "error";
    return "idle";
  }

  set(prop: "loading" | "done" | "error", value: boolean): HttpStatus {
    this[<string>prop] = value;
    return this;
  }
}
