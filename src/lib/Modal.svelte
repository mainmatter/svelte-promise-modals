<script lang="ts">
  import { createFocusTrap, type FocusTrap } from 'focus-trap';
  import { onDestroy, onMount } from 'svelte';
  import { get } from 'svelte/store';

  import type { Modal as ModalClass } from './modal';
  import { animating, globalOptions } from './service';
  import type { FocusTrapOptions } from './types';

  type AnimationEndHandler = GlobalEventHandlers['onanimationend'];
  type OnDeactivateCallback = (() => void) | null;

  export let modal: ModalClass<any>;

  let isAnimatingOut = false;
  let focusTrap: FocusTrap;
  let modalElement: HTMLElement;
  let animationEnd: AnimationEndHandler | null = null;

  let focusTrapOptions: FocusTrapOptions;
  let optionsClassName = modal.options.className ?? '';

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

<!-- Note: all `spm-` prefixed class names are deliberate to keep them from being local to the
component. Don't style them here, always use a separate local class! -->

<div
  class="spm-backdrop backdrop"
  class:spm-out={isAnimatingOut}
  tabindex="-1"
  role="presentation"
  aria-hidden="true"
  data-testid="backdrop"
></div>

<div class="spm-modal-container modal-container">
  <div
    data-testid="spm-modal"
    class="spm-modal modal {optionsClassName}"
    class:spm-out={isAnimatingOut}
    bind:this={modalElement}
  >
    <svelte:component this={modal.component} {...modal.props} closeModal={close} />
  </div>
</div>

<style>
  .backdrop {
    opacity: 0;
  }

  .modal-container {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
  }

  .backdrop,
  .modal-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .modal {
    margin: auto;
    opacity: 0;
    transform: translate(0, -30vh) scale(1.1);
    -webkit-overflow-scrolling: touch; /* momentum-based scrolling for Safari on iOS */
  }
</style>
