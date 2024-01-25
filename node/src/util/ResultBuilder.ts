const initialValue: Result = {
  ok: true,
  error: false,
  message: "",
  body: {},
};

export interface Result {
  ok: boolean;
  error: boolean;
  message: string;
  body: { [key: string]: any };
}

export class ResultBuilder {
  private _obj: Result = { ...initialValue };

  get result(): Result {
    return this._obj;
  }

  get json(): string {
    return JSON.stringify(this.result);
  }

  reset ()  {
    this._obj = { ...initialValue };
    return this;
  };

  error (message?: string)  {
    this._obj.error = true;
    this._obj.ok = false;
    this._obj.message = message || "";
    return this;
  };

  ok (message?: string)  {
    this._obj.error = false;
    this._obj.ok = true;
    this._obj.message = message || "";
    return this;
  };

  body (body?: { [key: string]: any })  {
    this._obj.body = body || {};
    return this;
  };
}
