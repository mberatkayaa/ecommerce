import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { domain } from "../misc/constants";
import { BehaviorSubject, Observable, catchError, concatMap, takeLast, tap, throwError } from "rxjs";
import { User } from "../models/User.model";
import { jwtDecode } from "jwt-decode";
import { httpErr, notifier, processHttp } from "../misc/rxjsOperators";
import { HttpResult } from "../misc/types";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private _tokenExpirationIntervalId;
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {}

  checkStoredToken() {
    const token = localStorage.getItem("token");
    if (token) {
      this.signedInHandler(token);
    }
  }

  signOut() {
    localStorage.removeItem("token");
    this.user.next(null);
    this.clearInterval();
  }

  isAdmin(): Observable<any>;
  isAdmin(email: string, password: string): Observable<any>;
  isAdmin(email?: string, password?: string): Observable<any> {
    if (!email) {
      return notifier(this.http.get(domain + "admin").pipe(httpErr()), true);
    }

    return this.auth(email, password).pipe(
      takeLast(1),
      concatMap((val) => {
        return this.isAdmin();
      })
    );
  }

  auth(email: string, password: string, endPoint: "signin" | "signup" = "signin") {
    return notifier<any>(
      this.http.post<HttpResult<any>>(domain + endPoint, { email, password }).pipe(
        httpErr(),
        tap((data: any) => {
          this.signedInHandler(data.body.token);
        })
      ),
      true
    );
  }

  private signedInHandler(token: string) {
    localStorage.setItem("token", token);
    const decoded = jwtDecode<{ email: string; exp: number; iat: number; _id: string }>(token);

    const expiration = decoded.exp * 1000 - new Date().getTime();
    if (expiration <= 0) {
      this.signOut();
      return;
    }

    const user = new User();
    user._id = decoded._id;
    user.email = decoded.email;
    user.token = token;
    user.exp = decoded.exp * 1000;
    this.user.next(user);

    this.clearInterval();
    this._tokenExpirationIntervalId = setInterval(() => {
      if (!user || user.exp - new Date().getTime() <= 0) {
        this.signOut();
        return;
      }
    }, 2000);
  }

  private clearInterval() {
    if (this._tokenExpirationIntervalId) {
      clearInterval(this._tokenExpirationIntervalId);
      this._tokenExpirationIntervalId = null;
    }
  }
}
