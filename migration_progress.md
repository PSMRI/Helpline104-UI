# `@angular/http` → `@angular/common/http` Migration Progress

## ✅ Batch 1 Complete — 5 Simplest Files

### 1. `data.service.ts` — Dead import removed
```diff
-import { Http, Response } from '@angular/http';
```
`Http` and `Response` were imported but never used. Pure cleanup.

---

### 2. `auth-guard.services.ts` — Dead import removed
```diff
-import { Http, Response } from '@angular/http';
```
Constructor uses `InterceptedHttp`, not `Http`. Neither symbol was referenced.

---

### 3. `http-service.service.ts` (DashboardHttpServices) — Full migration ✅
```diff
-import {Http, Response} from '@angular/http';
-import 'rxjs/add/operator/map';
+import { HttpClient } from '@angular/common/http';

-constructor(private  http: Http){}
+constructor(private  http: HttpClient){}

-return this.http.get(url).map((res:Response) => res.json());
+return this.http.get(url);
```
This was the cleanest migration — direct `Http` usage with no interceptor dependency.

---

### 4. `http_services.service.ts` (HttpServices) — Partial migration ⚠️
```diff
-import { Http, Response } from "@angular/http";
+import { HttpClient } from '@angular/common/http';

-private _http: Http,
+private _http: HttpClient,

 // getLanguage() — was using _http (direct Http), now uses HttpClient
-return this._http.get(url).map(this.handleGetlanguageSuccess).catch(this.handleGetError);
+return this._http.get(url);

 // Response type annotations → any
-handleGetSuccess(response: Response)
+handleGetSuccess(response: any)
```

> [!WARNING]
> `handleGetSuccess`, `handleGetSuccessForSecurity`, and `handleGetError` still call `.json()` because they process responses from `SecurityInterceptedHttp` (which extends the old `Http` class).

---

### 5. `login.service.ts` — Import removed, types updated ⚠️
```diff
-import { Http, Response } from "@angular/http";

-(res: Response) =>
+(res: any) =>

-private extractData(res: Response)
+private extractData(res: any)

-private handleError(error: Response | any)
+private handleError(error: any)
```

> [!WARNING]
> All `.json()` calls preserved — this service uses `InterceptedHttp` and `SecurityInterceptedHttp` which still return old-style `Response` objects.

---

## 🚧 Critical Blocker: Interceptor Layer

Before migrating the remaining ~45 service files, **the interceptor infrastructure must be migrated first**:

| File | Issue |
|---|---|
| `http.interceptor.ts` | `InterceptedHttp extends Http` — uses `ConnectionBackend`, `RequestOptions`, `RequestOptionsArgs`, `Response`, `Headers` from `@angular/http` |
| `http.securityinterceptor.ts` | `SecurityInterceptedHttp extends Http` — same old `@angular/http` dependency |
| `http.factory.ts` | Factory uses `XHRBackend`, `Http`, `RequestOptions` from `@angular/http` |
| `http.security.factory.ts` | Factory uses `XHRBackend`, `Http`, `RequestOptions` from `@angular/http` |

### Why this matters
- Both interceptors `extend Http` and return `Observable<Response>` (old Response)
- Every service using these interceptors calls `.json()` on responses
- Until interceptors return parsed JSON, removing `.json()` from services will **break the app**

### Recommended next step
Migrate the 4 interceptor/factory files to use Angular's `HttpInterceptor` interface with `HttpClient`. Once done, all ~45 remaining services can safely drop `.json()` calls.

## Overall Progress

| Status | Count | Files |
|---|---|---|
| ✅ Fully migrated | 3 | `data.service.ts`, `auth-guard.services.ts`, `http-service.service.ts` |
| ⚠️ Import removed, .json() retained | 2 | `login.service.ts`, `http_services.service.ts` |
| 🚧 Interceptor layer (blocker) | 4 | `http.interceptor.ts`, `http.securityinterceptor.ts`, `http.factory.ts`, `http.security.factory.ts` |
| ⬜ Remaining services | ~45 | Blocked on interceptor migration |
| ⬜ `app.module.ts` | 1 | `HttpModule` → `HttpClientModule` (do last) |
