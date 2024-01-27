import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, map, tap } from "rxjs";
import { Category } from "../models/Category.model";
import { domain } from "../misc/constants";
import { HttpStatus } from "../misc/HttpStatus";
import { getGroupName } from "../misc/helpers";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  categories = new BehaviorSubject<Array<Category>>(null);
  status = new BehaviorSubject<HttpStatus>(new HttpStatus());

  constructor(private http: HttpClient) {}

  refreshCategories(subject?: Subject<HttpStatus>) {
    this.statusSubject(new HttpStatus().set("loading", true), subject);
    return this.http.get(domain + "categories").pipe(
      map(this.mapFn),
      tap({
        next: (data) => {
          this.categories.next(data);
          this.statusSubject(new HttpStatus().set("done", true), subject);
        },
        error: (err) => {
          let message = err.message || "Kategoriler okunurken bir hata oluştu!";
          if (err.error && err.error.message) message = err.error.message;
          this.statusSubject(new HttpStatus().set("error", true).set("message", message), subject);
        },
      })
    );
  }

  addCategory(group: string, title: string, subject?: Subject<HttpStatus>) {
    this.statusSubject(new HttpStatus().set("loading", true), subject);
    return this.http.post(domain + "admin/categories/add", { group, title }).pipe(
      map(this.mapFn),
      tap({
        next: (data) => {
          this.categories.next([...this.categories.value, data]);
          this.statusSubject(new HttpStatus().set("done", true), subject);
        },
        error: (err) => {
          let message = err.message || "Kategori oluşturulurken bir hata oluştu!";
          if (err.error && err.error.message) message = err.error.message;
          this.statusSubject(new HttpStatus().set("error", true).set("message", message), subject);
        },
      })
    );
  }

  editCategory(_id: string, group: string, title: string, subject?: Subject<HttpStatus>) {
    this.statusSubject(new HttpStatus().set("loading", true), subject);
    return this.http.patch(domain + "admin/categories/edit", { _id, group, title }).pipe(
      map(this.mapFn),
      tap({
        next: (data) => {
          const category = data;
          this.categories.next([...this.categories.value.filter((x) => x._id !== _id), category]);
          this.statusSubject(new HttpStatus().set("done", true), subject);
        },
        error: (err) => {
          let message = err.message || "Kategori düzenlenirken bir hata oluştu!";
          if (err.error && err.error.message) message = err.error.message;
          this.statusSubject(new HttpStatus().set("error", true), subject);
        },
      })
    );
  }

  deleteCategory(_id: string, subject?: Subject<HttpStatus>) {
    this.statusSubject(new HttpStatus().set("loading", true), subject);
    return this.http.delete(domain + "admin/categories/delete/" + _id).pipe(
      tap({
        next: (data) => {
          this.categories.next([...this.categories.value.filter((x) => x._id !== _id)]);
          this.statusSubject(new HttpStatus().set("done", true), subject);
        },
        error: (err) => {
          let message = err.message || "Kategori düzenlenirken bir hata oluştu!";
          if (err.error && err.error.message) message = err.error.message;
          this.statusSubject(new HttpStatus().set("error", true), subject);
        },
      })
    );
  }

  mapFn(value) {
    if (!value || !value.body) return value;

    if (Array.isArray(value.body)) {
      return value.body.map((x) => ({ ...x, group: getGroupName(x.group) }));
    }
    if (value.body.group) return { ...value.body, group: getGroupName(value.body.group) };

    return value;
  }

  statusSubject(status: HttpStatus, externalSubject?: Subject<HttpStatus>, onlyExternal: boolean = false) {
    if (!onlyExternal) this.status.next(status);
    externalSubject?.next(status);
  }
}
