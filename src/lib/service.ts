import deepmerge from 'deepmerge';
import type { ComponentType } from 'svelte';
import { derived, get, writable } from 'svelte/store';

import { BROWSER as browser } from 'esm-env';
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

export const openModal = (component: ComponentType, data?: object, options?: object) => {
  let modal: Modal = new Modal(component, data, options);

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

export function destroyModals() {
  get(stack).forEach((m) => m.destroy());
}

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

export function onModalAnimationStart() {
  if (browser) {
    document.body.classList.add('spm-animating');
  }
}

export function onModalAnimationEnd() {
  if (browser) {
    document.body.classList.remove('spm-animating');
  }
}
