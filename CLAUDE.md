# AMRIT Helpline104-UI — AI Agent Context

Angular **4.1.3** frontend for the AMRIT 104 health information helpline.
Works with **Helpline104-API** (Java/Spring Boot) at `localhost:8080` in dev.

> ⚠️ **LEGACY CODEBASE** — This project uses end-of-life libraries intentionally.
> Do NOT upgrade any dependencies without a full migration plan agreed with the team.
> A migration to Angular 19 is tracked separately (C4GT DMP 2026 Issue #129).

## Tech Stack (Current — Legacy, Do Not Upgrade)
| Package | Version | Status |
|---|---|---|
| `@angular/core` | 4.1.3 | EOL — migration planned |
| `@angular/http` | 4.1.3 | Removed in Angular 9 — do not replace yet |
| `@angular/material` | 2.0.0-beta.11 | Uses `md-` prefix (not `mat-`) |
| `rxjs` | 5.4.2 | Prototype-patching API — see RxJS section |
| `socket.io-client` | 2.0.4 | Used for Czentrix telephony |
| `md2` | 0.0.18 | Third-party Material 2 supplement |
| `ng2-smart-table` | — | Data table library |
| `bootstrap` | 3.x | CSS grid and utilities |

## Folder Structure
```
src/app/
├── login/                  ← Auth: login, OTP, role selection
├── dashboard/              ← Agent dashboard, call queue
├── dashboard-user-id/      ← Czentrix telephony integration
├── 104Services/            ← Main case sheet entry point
├── 104-*/                  ← Role-specific views (mo, counsellor, ro, pd...)
├── closure/                ← Call closure flow
├── services/               ← All 67 Angular services
│   ├── common/             ← Shared utilities
│   └── dialog/             ← ConfirmationDialogsService
├── directives/             ← 20 form validation directives
└── app.module.ts           ← 530-line monolithic NgModule
```

## HTTP Pattern — @angular/http (Legacy)
All services use `@angular/http` (`Http`, `Headers`, `RequestOptions`).
Responses **must** call `.map(res => res.json())` — unlike HttpClient, this does NOT auto-parse JSON.
```typescript
// Correct pattern for this codebase
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

this.http.post(url, body, options)
  .map(res => res.json())   // ← required — remove this and you get a Response object, not data
  .catch(err => Observable.throw(err));
```

## RxJS 5 — Prototype Patching (Legacy)
This codebase uses RxJS 5 prototype-patching imports. Use this style consistently:
```typescript
// RxJS 5 import style (used throughout this project)
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
```
Do **not** use pipeable operators (`pipe(map(...))`) — they are RxJS 6+ style and will break.

## Czentrix Telephony (Socket.io 2.x)
The `DashboardUserIdComponent` connects to the Czentrix telephony server via Socket.io 2.x.
Event names (`incoming_call`, `agent_login`, `call_answered`, etc.) must not be renamed.
The telephony server version matches socket.io-client 2.0.4 — do not upgrade socket.io-client.

## Angular Material — `md-` prefix
This codebase uses Angular Material **2.0.0-beta.11**, which uses the `md-` prefix:
```html
<!-- Correct for this version -->
<md-input-container>...</md-input-container>
<md-select>...</md-select>
<md-button>...</md-button>

<!-- Wrong — mat- prefix is Angular Material 5+ -->
<mat-form-field>...</mat-form-field>
```

## Alert / Dialog Pattern
Use `ConfirmationDialogsService` for all user dialogs — not native `alert()` or `confirm()`.
```typescript
// Injected as: private dialogService: ConfirmationDialogsService
this.dialogService.alert('Something went wrong');
this.dialogService.confirm('Confirm', 'Are you sure?').subscribe(result => { ... });
```

## Clinical Data — DO NOT MODIFY
The case sheet logic contains clinical decision support (CDSS) rules.
Do not refactor conditions or reorder logic in:
- `104Services/` components (chief complaint handling)
- Any service method named `getCdssData` or similar
- Any constant with values that look like clinical codes

These are clinical business rules, not dead code.

## Build & Run
```bash
npm install     # No --legacy-peer-deps needed for this older Angular version
npm start       # Dev server at http://localhost:4200
npm run build   # Production build
```
Requires Node.js **6.x or 8.x** (Angular 4 does not support Node 18).
Use `nvm use 8` before running npm commands.
Backend: Helpline104-API must be running at `localhost:8080`.

## Key Files
| File | Purpose |
|---|---|
| `src/app/app.module.ts` | 530-line monolithic NgModule — all 118 components declared here |
| `src/app/http.interceptor.ts` | Adds auth token to every request |
| `src/app/http.factory.ts` | `httpFactory` — wires the interceptor into `@angular/http` |
| `src/app/services/dialog/confirmation.service.ts` | App-wide alert/confirm dialog service |
| `src/app/dashboard-user-id/dashboardUserId.component.ts` | Czentrix Socket.io connection |
| `src/environments/environment.ts` | API URLs and config |

## Connected Repos
| Repo | Purpose |
|---|---|
| `PSMRI/Helpline104-API` | All backend REST endpoints |
| `PSMRI/Common-API` | Beneficiary lookup, session management |
| `PSMRI/Identity-API` | Beneficiary creation |
