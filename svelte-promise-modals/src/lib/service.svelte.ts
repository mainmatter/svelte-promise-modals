import deepmerge from 'deepmerge';
import { type Component, onDestroy } from 'svelte';
import { derived, get, writable } from 'svelte/store';

import { Modal } from './modal';
import type { ModalOptions, PropsWithoutCloseModal } from './types';

export const animating = writable<boolean>(false);
export const stack = writable<Modal<any>[]>([]);
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

export const openModal = <T extends Component>(
  component: Component<T>,
  props?: PropsWithoutCloseModal<T> | null, // `null` is a convenience for when you don't want to pass any props but do want to pass options
  options?: ModalOptions
): Modal<T> => {
  let modal: Modal<T> = new Modal(component, props ?? undefined, options) as Modal<T>;

  stack.update((modals) => [...modals, modal]);

  return modal;
};

export const createOpenModal = () => {
  let modals: Modal<any>[] = [];

  onDestroy(() => {
    while (modals.length) {
      modals.pop()?.destroy();
    }
  });

  return <T extends Component>(...args: Parameters<typeof openModal<T>>) => {
    let modal = openModal(...args);
    modals.push(modal);
    return modal;
  };
};

export const removeFromStack = (modal: unknown) => {
  stack.update(($stack) => $stack.filter((m) => m !== modal));
};

export function destroyModals() {
  get(stack).forEach((m) => m.destroy());
}
