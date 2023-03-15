import deepmerge from 'deepmerge';
import type { ComponentType } from 'svelte';
import { derived, get, writable } from 'svelte/store';

import { browser } from '$app/environment';

import { Modal } from './modal';
import type { ModalOptions } from './types';

export const stack = writable<Modal[]>([]);
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

export const open = (component: ComponentType, data?: object, options?: object) => {
  let modalOptions = deepmerge(get(globalOptions), options ?? {});
  let modal: Modal = new Modal(component, data, modalOptions);

  stack.update((modals) => {
    let stack = [...modals, modal];
    if (stack.length === 1) {
      onFirstModalAdded();
    }

    return stack;
  });

  return modal;
};

export const removeFromStack = (modal: unknown) => {
  stack.update(($stack) => $stack.filter((m) => m !== modal));
};

stack.subscribe((modals) => {
  if (modals.length === 0) {
    onLastModalRemoved();
  }
});

function onFirstModalAdded() {
  if (browser) {
    document.body.classList.add('spm-scrolling-disabled');
  }
}

function onLastModalRemoved() {
  if (browser) {
    document.body.classList.remove('spm-scrolling-disabled');
  }
}
