import deepmerge from 'deepmerge';
import type { ComponentProps, ComponentType, SvelteComponent } from 'svelte';
import { derived, get, writable } from 'svelte/store';

import { Modal } from './modal';
import type { ModalOptions } from './types';

export const animating = writable<boolean>(false);
export const stack = writable<Modal<any, any>[]>([]);
export const count = derived(stack, ($stack) => $stack.filter((modal) => !modal.isClosing).length);
export const top = derived(stack, ($stack) => $stack.at(-1));
export const globalOptions = writable({
  focusTrapOptions: {
    clickOutsideDeactivates: true,
  },
});

export { globalOptions as options };

export const updateOptions = (userOptions: Partial<ModalOptions>) => {
  if (userOptions && typeof userOptions === 'object') {
    globalOptions.update((defaultOptions) => {
      return deepmerge(defaultOptions, userOptions);
    });
  }
};

export const openModal = <T extends SvelteComponent, V extends ComponentProps<T>>(
  component: ComponentType<T>,
  props?: Omit<V, 'closeModal'>,
  options?: ModalOptions
): Modal<T, V> => {
  // TODO: fix `component as T` type assertion
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let modal: Modal<T, V> = new Modal(component as T, props, options);

  stack.update((modals) => [...modals, modal]);

  return modal;
};

export const removeFromStack = (modal: unknown) => {
  stack.update(($stack) => $stack.filter((m) => m !== modal));
};

export function destroyModals() {
  get(stack).forEach((m) => m.destroy());
}
