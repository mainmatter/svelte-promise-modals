import type RSVP from 'rsvp';
import { defer } from 'rsvp';
import { derived, writable } from 'svelte/store';

type Modal = {
  deferred: RSVP.Deferred<unknown>;
  component: unknown;
  data: unknown;
  result?: unknown;
  isClosing: boolean;
  deferredOutAnimation?: RSVP.Deferred<unknown>;
  options: {
    onAnimationModalOutEnd?: () => void;
  };
  resolve(value?: unknown): void;
  remove(): void;
  then(
    onFulfilled: (value: RSVP.Arg<unknown>) => unknown,
    onRejected?: (reason: RSVP.Arg<unknown>) => unknown
  ): Promise<unknown>;
};

export const stack = writable<Modal[]>([]);
export const count = derived(stack, ($stack) => $stack.filter((modal) => !modal.isClosing).length);
export const top = derived(stack, ($stack) => $stack.at(-1));

export const open = (component: object, data?: object, options?: object) => {
  let modal: Modal = {
    component,
    data,
    result: undefined,
    deferred: defer(),
    get isClosing() {
      return Boolean(this.deferredOutAnimation);
    },
    options: {
      onAnimationModalOutEnd: undefined,
      ...options,
    },
    resolve(value: unknown) {
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
    },
    then(onFulfilled, onRejected) {
      return this.deferred.promise.then(onFulfilled, onRejected);
    },
    remove() {
      removeFromStack(this);
      this.deferredOutAnimation?.resolve();
    },
  };

  stack.update((modals) => [...modals, modal]);

  return modal;
};

const removeFromStack = (modal: unknown) => {
  stack.update(($stack) => $stack.filter((m) => m !== modal));
};
