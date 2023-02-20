import { derived, writable } from 'svelte/store';

type Modal = {
  component: unknown;
  data: unknown;
  result?: unknown;
  resolve(value: unknown): void;
  remove(): void;
};

export const stack = writable<Modal[]>([]);
export const count = derived(stack, ($stack) => $stack.length);
export const top = derived(stack, ($stack) => $stack.at(-1));

export const open = (component: object, data?: object) => {
  let modal: Modal = {
    component,
    data,
    result: undefined,
    resolve(value: unknown) {
      this.result = value;
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
