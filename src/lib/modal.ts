import type RSVP from 'rsvp';
import { defer } from 'rsvp';

import { removeFromStack } from './service';

type ModalOptions = {
  onAnimationModalOutEnd(): void;
};

export class Modal {
  deferred: RSVP.Deferred<unknown> = defer();
  component: unknown;
  data: object;
  result?: unknown;
  deferredOutAnimation?: RSVP.Deferred<unknown>;

  options: ModalOptions;

  constructor(component: object, data?: object, options?: Partial<ModalOptions>) {
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
