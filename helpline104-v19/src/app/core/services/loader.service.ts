import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private _show = signal(false);
  readonly showState = this._show.asReadonly();

  toggle(value: boolean) {
    this._show.set(value);
  }

  show() {
    this._show.set(true);
  }

  hide() {
    this._show.set(false);
  }
}
