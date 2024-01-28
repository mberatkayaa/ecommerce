import { HttpErrorResponse } from "@angular/common/http";
import { Observable, take } from "rxjs";
import { ResultBuilder } from "./ResultBuilder";
import { HttpResult } from "./types";
import { HttpStatus } from "./HttpStatus";

export function processHttp(args?: { errorMessage?: string; asError?: boolean }) {
  return function <T>(source: Observable<HttpResult<T> | T>): Observable<HttpResult<T>> {
    return new Observable((subscriber) => {
      source.subscribe({
        next(value) {
          const resultBuilder = new ResultBuilder<T>();
          if (!value)
            resultBuilder
              .ok()
              .body(<T>value)
              .source("ngClient");
          else {
            const valResult: HttpResult<T> = <any>value;
            if (valResult.source === "dedicatedServer" || valResult.source === "ngClient") {
              resultBuilder.fromResult(valResult);
            } else {
              resultBuilder
                .ok()
                .body(<T>value)
                .source("ngClient");
            }
          }
          subscriber.next(resultBuilder.result);
        },
        error(err: HttpErrorResponse) {
          const resultBuilder = new ResultBuilder<T>();
          resultBuilder
            .error(args && args.errorMessage ? args.errorMessage : err.message || "Sunucuya erişim sağlanamadı!")
            .source("ngClient");
          if (err.error && (err.error.source === "dedicatedServer" || err.error.source === "ngClient")) {
            const errResult: HttpResult<T> = err.error;
            resultBuilder.fromResult(errResult);
          }
          if (args && args.asError) subscriber.error(resultBuilder.result);
          else subscriber.next(resultBuilder.result);
        },
        complete() {
          subscriber.complete();
        },
      });
    });
  };
}

export function httpNext(errorMessage: string = "Sunucuya erişilemedi!") {
  return processHttp({ asError: false, errorMessage: errorMessage });
}

export function httpErr(errorMessage: string = "Sunucuya erişilemedi!") {
  return processHttp({ asError: true, errorMessage: errorMessage });
}

export interface HttpStreamResult<T> {
  status: HttpStatus;
  result: HttpResult<T> | null;
  bag: any;
  setBag: (value: any) => void;
}

export function notifier<T>(obs: Observable<HttpResult<T>>, asError: boolean = false) {
  const bagOwner = { bag: null };
  const setBag: (value: any) => void = (value) => {
    bagOwner.bag = value;
  };
  return new Observable<HttpStreamResult<T>>((subscriber) => {
    subscriber.next({ status: new HttpStatus().set("loading", true), result: null, bag: bagOwner.bag, setBag });
    obs.pipe(take(1)).subscribe({
      next: (value) => {
        let res = {
          status: new HttpStatus().set("done", value.ok).set("error", value.error),
          result: value,
          bag: bagOwner.bag,
          setBag,
        };
        if (value.error && asError) {
          subscriber.error(res);
          subscriber.complete();
          return;
        }
        subscriber.next(res);
        subscriber.complete();
      },
      error: (value) => {
        let res = { status: new HttpStatus().set("error", true), result: value, bag: bagOwner.bag, setBag };
        if (asError) {
          subscriber.error(res);
          subscriber.complete();
          return;
        }
        subscriber.next(res);
        subscriber.complete();
      },
    });
  });
}
