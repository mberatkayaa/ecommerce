import { Injectable } from "@angular/core";
import { BehaviorSubject, takeLast, tap } from "rxjs";
import { Category } from "../models/Category.model";
import { HttpClient } from "@angular/common/http";
import { HttpResult } from "../misc/types";
import { domain } from "../misc/constants";
import { httpErr, notifier } from "../misc/rxjsOperators";

@Injectable({
  providedIn: "root",
})
export class GroupService {
  groups = new BehaviorSubject<Array<{ name: string; value: string; categories: Array<Category> }>>(null);

  constructor(private http: HttpClient) {}

  refreshGroups() {
    return notifier(this.http.get<HttpResult<any>>(domain + "groups").pipe(httpErr())).pipe(
      takeLast(1),
      tap({
        next: (data) => {
          this.groups.next(data.result.body);
        },
      })
    );
  }
}
