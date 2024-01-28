import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, map, take, takeLast, tap } from "rxjs";
import { Category } from "../models/Category.model";
import { domain } from "../misc/constants";
import { HttpStatus } from "../misc/HttpStatus";
import { getGroupName } from "../misc/helpers";
import { HttpStreamResult, httpErr, notifier } from "../misc/rxjsOperators";
import { HttpResult } from "../misc/types";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  categories = new BehaviorSubject<Array<Category>>(null);

  constructor(private http: HttpClient) {}

  /*+*/refreshCategories() {
    return notifier(
      this.http.get<HttpResult<any>>(domain + "categories").pipe(httpErr("Kategoriler okunurken bir hata oluştu!"))
    ).pipe(
      takeLast(1),
      map<HttpStreamResult<any>, HttpStreamResult<any>>(this.mapFn),
      tap({
        next: (data) => {
          this.categories.next(data.result.body);
        },
      })
    );
  }

  /*+*/addCategory(group: string, title: string) {
    return notifier(
      this.http
        .post<HttpResult<any>>(domain + "admin/categories/add", { group, title })
        .pipe(httpErr("Kategori oluşturulurken bir hata oluştu!"))
    ).pipe(
      takeLast(1),
      map<HttpStreamResult<any>, HttpStreamResult<any>>(this.mapFn),
      tap({
        next: (data) => {
          this.categories.next([...this.categories.value, data.result.body]);
        },
      })
    );
  }

  /*+*/editCategory(_id: string, group: string, title: string) {
    return notifier(
      this.http
        .patch(domain + "admin/categories/edit", { _id, group, title })
        .pipe(httpErr("Kategori düzenlenirken bir hata oluştu!"))
    ).pipe(
      takeLast(1),
      map<HttpStreamResult<any>, HttpStreamResult<any>>(this.mapFn),
      tap({
        next: (data) => {
          const category = data.result.body;
          this.categories.next([...this.categories.value.filter((x) => x._id !== _id), category]);
        },
      })
    );
  }

  /*+*/deleteCategory(_id: string) {
    return notifier(
      this.http
        .delete(domain + "admin/categories/delete/" + _id)
        .pipe(httpErr("Kategori düzenlenirken bir hata oluştu!"))
    ).pipe(
      tap({
        next: (data) => {
          this.categories.next([...this.categories.value.filter((x) => x._id !== _id)]);
        },
      })
    );
  }

  mapFn(value) {
    if (!value || !value.result || !value.result.body) return value;

    const obj = value.result.body;
    if (Array.isArray(obj)) {
      value.result.body = obj.map((x) => ({ ...x, group: getGroupName(x.group) }));
    } else if (obj.group) {
      value.result.body = { ...obj, group: getGroupName(obj.group) };
    }

    return value;
  }
}
