import type RSVP from 'rsvp';
import { defer } from 'rsvp';
import { derived, writable } from 'svelte/store';

type Modal = {
  deferred: RSVP.Deferred<unknown>;
  component: unknown;
  data: unknown;
  result?: unknown;
  isClosing: boolean;
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

export const open = (component: object, data?: object) => {
  let modal: Modal = {
    component,
    data,
    result: undefined,
    deferred: defer(),
    isClosing: false,
    resolve(value: unknown) {
      this.result = value;
      this.isClosing = true;
      this.deferred.resolve(value);
    },
    then(onFulfilled, onRejected) {
      return this.deferred.promise.then(onFulfilled, onRejected);
    },
    remove() {
      removeFromStack(this);
    },
  };

  stack.update((modals) => [...modals, modal]);

  return modal;
};

const removeFromStack = (modal: unknown) => {
  stack.update(($stack) => $stack.filter((m) => m !== modal));
};
