import { HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { ResultBuilder } from "./ResultBuilder";
import { HttpResult } from "./types";


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
          resultBuilder.error(err.message || "Sunucuya erişim sağlanamadı!").source("ngClient");
          if (err.error && (err.error.source === "dedicatedServer" || err.error.source === "ngClient")) {
            const errResult: HttpResult<T> = err.error;
            resultBuilder.fromResult(errResult);
          }
          if (args && args.errorMessage) {
            resultBuilder.error(args.errorMessage);
          }
          if (args && args.asError) subscriber.error(resultBuilder.result);
          else subscriber.next(resultBuilder.result);
        },
      });
    });
  };
}
