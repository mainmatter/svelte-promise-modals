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

// Overload for components that don't require props (or all props are optional)
export function openModal<T extends Component<any>>(
  component: T,
  props?: null,
  options?: ModalOptions
): Modal<T>;

// Overload for components that require props
export function openModal<T extends Component<any>>(
  component: T,
  props: T extends Component<infer P> ? PropsWithoutCloseModal<P> : never,
  options?: ModalOptions
): Modal<T>;

// Implementation
export function openModal<T extends Component<any>>(
  component: T,
  props?: any,
  options?: ModalOptions
): Modal<T> {
  let modal: Modal<T> = new Modal(component, props ?? undefined, options) as Modal<T>;

  stack.update((modals) => [...modals, modal]);

  return modal;
}

export const createOpenModal = () => {
  let modals: Modal<any>[] = [];

  onDestroy(() => {
    while (modals.length) {
      modals.pop()?.destroy();
    }
  });

  function scopedOpenModal<T extends Component<any>>(
    component: T,
    props?: null,
    options?: ModalOptions
  ): Modal<T>;
  function scopedOpenModal<T extends Component<any>>(
    component: T,
    props: T extends Component<infer P> ? PropsWithoutCloseModal<P> : never,
    options?: ModalOptions
  ): Modal<T>;
  function scopedOpenModal<T extends Component<any>>(
    component: T,
    props?: any,
    options?: ModalOptions
  ): Modal<T> {
    let modal = openModal(component, props as any, options);
    modals.push(modal);
    return modal;
  }

  return scopedOpenModal;
};

export const removeFromStack = (modal: unknown) => {
  stack.update(($stack) => $stack.filter((m) => m !== modal));
};

export function destroyModals() {
  get(stack).forEach((m) => m.destroy());
}
