import deepmerge from 'deepmerge';
import { type ComponentType, onDestroy, type SvelteComponent } from 'svelte';
import { derived, get, writable } from 'svelte/store';

import { Modal } from './modal';
import type { ModalOptions, PropsWithoutCloseModal } from './types';

export const modalContainerCount = writable<number>(0);
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

export const openModal = <T extends SvelteComponent>(
  component: ComponentType<T>,
  props?: PropsWithoutCloseModal<T> | null, // `null` is a convenience for when you don't want to pass any props but do want to pass options
  options?: ModalOptions
): Modal<T> => {
  if (get(modalContainerCount) === 0) {
    throw new Error('<ModalContainer /> is missing');
  } else if (get(modalContainerCount) > 1) {
    throw new Error('Multiple <ModalContainer /> instances exist in the application. Please make sure there is only one rendered at a time.');
  }

  let modal: Modal<T> = new Modal(component, props ?? undefined, options);

  stack.update((modals) => [...modals, modal]);

  return modal;
};

export function useModalContext() {
  let modals: Modal<any>[] = [];

  onDestroy(() => {
    while (modals.length) {
      modals.pop()?.close();
    }
  });

  return {
    openModal<T extends SvelteComponent>(
      ...args: Parameters<typeof openModal<T>>
    ): ReturnType<typeof openModal<T>> {
      let modal = openModal(...args);

      modals.push(modal);

      modal.then((value) => {
        let modalIndex = modals.indexOf(modal);
        if (modalIndex > -1) {
          modals.splice(modalIndex, 1);
        }

        return value;
      });

      return modal;
    },
  };
}

export const removeFromStack = (modal: unknown) => {
  stack.update(($stack) => $stack.filter((m) => m !== modal));
};

export function destroyModals() {
  get(stack).forEach((m) => m.destroy());
}
