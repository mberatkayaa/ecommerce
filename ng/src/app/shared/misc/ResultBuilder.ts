import { HttpResult } from "./types";

const initialValue: HttpResult<any> = {
  ok: true,
  error: false,
  message: "",
  body: {},
  source: "dedicatedServer",
};

// export interface Result {
//   ok: boolean;
//   error: boolean;
//   message: string;
//   body: { [key: string]: any };
//   source: string;
// }

export class ResultBuilder<T> {
  private _obj: HttpResult<T> = { ...initialValue };

  get result(): HttpResult<T> {
    return this._obj;
  }

  get json(): string {
    return JSON.stringify(this.result);
  }

  reset() {
    this._obj = { ...initialValue };
    return this;
  }

  error(message?: string) {
    this._obj.error = true;
    this._obj.ok = false;
    this._obj.message = message || "";
    return this;
  }

  ok(message?: string) {
    this._obj.error = false;
    this._obj.ok = true;
    this._obj.message = message || "";
    return this;
  }

  body(body?: T | null) {
    this._obj.body = body || <any>{};
    return this;
  }

  source(value: string) {
    this._obj.source = value;
    return this;
  }

  fromResult(result: HttpResult<T>) {
    this._obj = { ...result };
    return this;
  }
}
