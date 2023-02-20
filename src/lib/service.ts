import { derived, writable } from 'svelte/store';

export const stack = writable<unknown[]>([]);
export const count = derived(stack, ($stack) => $stack.length);
export const top = derived(stack, ($stack) => $stack.at(-1));

const removeFromStack = (modal: unknown) => {
  stack.update(($stack) => $stack.filter((m) => m !== modal));
};

export const open = (component: object, data?: object) => {
  let modal = {
    component,
    data,
    remove() {
      removeFromStack(this);
    },
  };

  stack.update((modals) => [...modals, modal]);

  return modal;
};
