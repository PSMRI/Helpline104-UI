# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AMRIT Helpline 104 UI -- an Angular-based call centre application for the 104 health helpline. Supports multiple agent roles (HAO, MO, CO, PD, SIO, RO, Counsellor, Surveyor, Supervisor) for medical advice, grievance handling, and health information services. Part of the AMRIT healthcare EHR platform by Piramal Swasthya. Licensed under GPL v3.

## Common Commands

```bash
npm start              # Dev server (opens browser automatically)
npm run build-prod     # Production build
npm run build-ci       # CI build (EJS template + env vars, copies WEB-INF to dist)
npm test               # Karma + Jasmine tests
npm run lint           # Lint
npm run e2e            # Protractor end-to-end tests
```

Note: `npm start` and `postinstall` run `node version.js` to generate `git-version.json`.

## Tech Stack

**Angular 4.x** (legacy) with Angular Material 2.x (Md-prefixed components like `MdDatepickerModule`, `MdInputModule`, `MdSelectModule`). Uses `@angular/http` (deprecated `Http` module, not `HttpClient`). CLI config is `.angular-cli.json` (not `angular.json`).

## Architecture

All components are eagerly loaded in a single `AppModule` -- no lazy-loaded feature modules. Uses `NgModule` pattern with `CUSTOM_ELEMENTS_SCHEMA`.

### Key Directories (under `src/app/`)

- **`104/`** -- Main helpline component shell
- **`104-co/`** -- Counselling Officer role
- **`104-mo/`** -- Medical Officer role
- **`104-hao/`** -- Health Advisory Officer role
- **`104-pd/`** -- Program Director role
- **`104-sio/`** -- Service Improvement Officer role
- **`104-ro/`** -- Resource Officer role
- **`104-counsellor/`** -- Counsellor role
- **`104-supervisor/`** -- Supervisor role
- **`104-surveyor/`** -- Surveyor role
- **`104-consent/`** -- Consent management
- **`algo-component/`** -- Algorithm-based triage/advice component
- **`beneficiary-registration-104/`** -- Beneficiary registration
- **`call-statistics/`** -- Call statistics dashboard
- **`blood-on-call-detailed-report/`** -- Blood-on-call reporting
- **`services/`** -- Shared services (`ConfirmationDialogsService`, `LoaderService`, `AvailableServices`)

### Common Patterns

- **HTTP Interceptor:** Custom `InterceptedHttp` class extending `Http` (via `httpFactory` provider).
- **Dialogs:** `ConfirmationDialogsService` wrapping Material dialogs.
- **Loader:** `LoaderComponent` + `LoaderService` for spinner management.
- **Pagination:** `ngx-pagination` for list views.
- **Tables:** `ng2-smart-table` for data grids.
- **Forms:** Mix of template-driven (`FormsModule`) and reactive (`ReactiveFormsModule`).

### Environment Configuration

Environment files in `src/environments/`. CI builds use `scripts/ci-prebuild.js` to generate `environment.ci.ts` from EJS template. WAR packaging copies `WEB-INF/` into `dist/`.

### Build / Deploy

Packaged as a WAR file via Maven (`pom.xml`). `WEB-INF/` directory is copied into dist during CI build.
