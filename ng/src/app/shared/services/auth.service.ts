import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { domain } from "../misc/constants";
import { BehaviorSubject, Observable, catchError, concatMap, tap, throwError } from "rxjs";
import { User } from "../models/User.model";
import { jwtDecode } from "jwt-decode";

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

  signUp(email: string, password: string) {
    return this.auth(email, password, "signup");
  }

  signIn(email: string, password: string) {
    return this.auth(email, password, "signin");
  }

  signOut() {
    localStorage.removeItem("token");
    this.user.next(null);
    this.clearInterval();
  }
  makeDate(): Date; // 1. Bir parametreli
  makeDate(m: number, d: number, y: number): Date; // 2. Üç parametreli
  makeDate(mOrTimestamp?: number, d?: number, y?: number): Date {
    // 3. Üç parametreli
    if (d !== undefined && y !== undefined) {
      return new Date(y, mOrTimestamp, d);
    } else {
      return new Date(mOrTimestamp);
    }
  }
  isAdmin(): Observable<any>;
  isAdmin(email: string, password: string): Observable<any>;
  isAdmin(email?: string, password?: string): Observable<any> {
    if (!email) {
      return this.http.get(domain + "admin").pipe(
        catchError((err) => {
          return throwError(() => err);
        })
      );
    }

    return this.auth(email, password).pipe(
      concatMap((val) => {
        return this.isAdmin();
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  auth(email: string, password: string, endPoint: "signin" | "signup" = "signin") {
    return this.http.post(domain + endPoint, { email, password }).pipe(
      catchError((err) => {
        let message = "Sunucuya erişim sağlanamadı!";
        if (err.error && err.error.message) {
          message = err.error.message;
        }
        return throwError(() => message);
      }),
      tap((data: any) => {
        this.signedInHandler(data.body.token);
      })
    );
  }

  private signedInHandler(token: string) {
    localStorage.setItem("token", token);
    const decoded = jwtDecode<{ email: string; exp: number; iat: number; _id: string }>(token);
    console.log("decoded", decoded);

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
