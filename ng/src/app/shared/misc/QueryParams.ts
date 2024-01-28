import { HttpParams } from "@angular/common/http";

export class QueryParams<T extends { [key: string]: string | number | boolean }> {
  obj: T;

  constructor(init?: T) {
    this.obj = init;
    if (!init) this.obj = <any>{};
  }

  get(key: string) {
    return this.obj[key];
  }

  set(values?: { [key: string]: any }) {
    let result = { ...this.obj };
    if (values) {
      result = { ...result, ...values };
    }
    return result;
  }

  setPermanent(values?: { [key: string]: any }) {
    if (values) {
      this.obj = { ...this.obj, ...values };
    }
    return this.obj;
  }

  httpParams(): HttpParams {
    let result = new HttpParams();
    for (const key in this.obj) {
      if (Object.prototype.hasOwnProperty.call(this.obj, key)) {
        const value = this.obj[key];
        if (value === null || value === undefined) continue;
        result = result.set(key, value);
      }
    }
    return result;
  }
}
