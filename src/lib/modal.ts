import type RSVP from 'rsvp';
import { defer } from 'rsvp';
import type { ComponentType, SvelteComponentTyped } from 'svelte';

import { removeFromStack } from './service';

type ModalOptions = {
  onAnimationModalOutEnd(): void;
};

export class Modal {
  private deferred: RSVP.Deferred<unknown> = defer();
  component: ComponentType;
  data: object | Record<string | number | symbol, unknown>;
  result?: unknown;
  deferredOutAnimation?: RSVP.Deferred<unknown>;
  componentInstance?: SvelteComponentTyped;

  options: ModalOptions;

  constructor(component: ComponentType, data?: object, options?: Partial<ModalOptions>) {
    this.component = component;
    this.data = data ?? {};
    this.options = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onAnimationModalOutEnd: (): void => {},
      ...options,
    };
  }

  resolve(value?: unknown): void {
    if (this.deferredOutAnimation) {
      return;
    }

    this.deferredOutAnimation = defer();
    if (this.options.onAnimationModalOutEnd) {
      this.deferredOutAnimation.promise
        .then(() => this.options.onAnimationModalOutEnd?.())
        .catch(() => {
          // noop
        });
    }

    this.result = value;
    this.deferred.resolve(value);
  }

  close() {
    this.remove();
  }

  remove(): void {
    removeFromStack(this);
    this.deferredOutAnimation?.resolve();
  }

  then(
    onFulfilled: (value: RSVP.Arg<unknown>) => unknown,
    onRejected?: (reason: RSVP.Arg<unknown>) => unknown
  ): Promise<unknown> {
    return this.deferred.promise.then(onFulfilled, onRejected);
  }

  get isClosing(): boolean {
    return Boolean(this.deferredOutAnimation);
  }
}
