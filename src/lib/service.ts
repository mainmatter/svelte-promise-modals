import { derived, writable } from 'svelte/store';

import { Modal } from './modal';

export const stack = writable<Modal[]>([]);
export const count = derived(stack, ($stack) => $stack.filter((modal) => !modal.isClosing).length);
export const top = derived(stack, ($stack) => $stack.at(-1));

export const open = (component: object, data?: object, options?: object) => {
  let modal: Modal = new Modal(component, data, options);

  stack.update((modals) => [...modals, modal]);

  return modal;
};

export const removeFromStack = (modal: unknown) => {
  stack.update(($stack) => $stack.filter((m) => m !== modal));
};
