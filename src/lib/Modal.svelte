<script lang="ts">
  import './svelte-promise-modals.css';

  import { createFocusTrap, type FocusTrap } from 'focus-trap';
  import { onDestroy, onMount } from 'svelte';
  import { get } from 'svelte/store';

  import type { Modal } from './modal';
  import { animating, globalOptions } from './service';
  import type { FocusTrapOptions } from './types';

  type AnimationEndHandler = GlobalEventHandlers['onanimationend'];
  type OnDeactivateCallback = (() => void) | null;

  export let modal: Modal;

  let isAnimatingOut = false;
  let focusTrap: FocusTrap;
  let modalElement: HTMLElement;
  let animationEnd: AnimationEndHandler | null = null;

  let focusTrapOptions: FocusTrapOptions;

  onMount(async () => {
    addFocusTrap();
    addAnimationListeners();
    animating.set(true);
  });

  onDestroy(() => {
    destroyModal();
  });

  const addFocusTrap = () => {
    let $globalOptions = get(globalOptions);
    let { focusTrapOptions: globalFocusTrapOptions } = $globalOptions;
    let { focusTrapOptions: localFocusTrapOptions } = modal.options;

    if (localFocusTrapOptions !== null) {
      focusTrapOptions = localFocusTrapOptions || globalFocusTrapOptions;
    }

    if (!focusTrapOptions) {
      return;
    }

    let options = {
      ...focusTrapOptions,
      fallbackFocus: modalElement,
      clickOutsideDeactivates: true,
      onDeactivate: (...args: unknown[]) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        focusTrapOptions.onDeactivate?.(...args);
        closeModal();
      },
    };

    focusTrap = createFocusTrap(modalElement, options);
    focusTrap.activate();
  };

  const removeFocusTrap = (onDeactivate?: OnDeactivateCallback) => {
    if (!focusTrap) {
      return;
    }

    if (typeof onDeactivate === 'undefined') {
      onDeactivate = focusTrapOptions.onDeactivate;
    }

    focusTrap.deactivate({ onDeactivate });
  };

  const addAnimationListeners = () => {
    animationEnd = ({ target, animationName }) => {
      // Ignore animations bubbling up
      if (target !== modalElement) {
        return;
      }

      animating.set(false);

      let isOutAnimation = animationName.slice(-4) === '-out';
      if (isOutAnimation) {
        modal.remove();
      }
    };

    if (modalElement) {
      modalElement.addEventListener('animationend', animationEnd);
    }
  };

  const removeAnimationListeners = () => {
    if (!animationEnd) {
      return;
    }

    if (modalElement) {
      modalElement.removeEventListener('animationend', animationEnd);
    }

    animationEnd = null;
  };

  export const destroyModal = () => {
    removeFocusTrap(null);
    removeAnimationListeners();

    modal.remove();
  };

  export const closeModal = (result?: unknown) => {
    if (isAnimatingOut) {
      return;
    }

    animating.set(true);

    // This triggers the out animation, which in turn will remove the modal after it completes
    isAnimatingOut = true;

    modal.resolve(result);
  };

  const close = (result: unknown) => {
    closeModal(result);
    removeFocusTrap();
  };
</script>

<div
  class="spm-backdrop"
  class:spm-out={isAnimatingOut}
  tabindex="-1"
  role="presentation"
  aria-hidden="true"
  data-testid="backdrop"
/>

<div class="spm-modal-container">
  <div
    data-testid="spm-modal"
    class="spm-modal"
    class:spm-out={isAnimatingOut}
    bind:this={modalElement}
  >
    <svelte:component this={modal.component} data={modal.data} {close} />
  </div>
</div>
