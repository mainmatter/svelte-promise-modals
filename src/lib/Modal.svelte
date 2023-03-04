<script lang="ts">
  import './svelte-promise-modals.css';

  import { createFocusTrap, type FocusTrap } from 'focus-trap';
  import { onDestroy, onMount } from "svelte";

  import type { Modal } from "./modal";

  type AnimationEndHandler = GlobalEventHandlers['onanimationend'];
  type OnDeactivateCallback = (() => void) | null;

  export let modal: Modal;

  let isAnimatingOut = false;
  let focusTrap: FocusTrap;
  let modalElement: HTMLElement;
  let animationEnd: AnimationEndHandler | null = null;

  onMount(async () => {
    addFocusTrap();
    addAnimationListeners();
  });

  onDestroy(() => {
    destroyModal();
  });

  const addFocusTrap = () => {
    let options = {
      fallbackFocus: modalElement,
      clickOutsideDeactivates: true,
      ...modal.options.focusTrapOptions,
      onDeactivate: () => {
        closeModal();
      },
    };

    focusTrap = createFocusTrap(modalElement, options);
    focusTrap.activate();
  }

  const removeFocusTrap = (onDeactivate?: OnDeactivateCallback) => {
    if (!focusTrap) {
      return;
    }

    focusTrap.deactivate({ onDeactivate });
  }

  const addAnimationListeners = () => {
    animationEnd = ({ target, animationName }) => {
      // Ignore animations bubbling up
      if (target !== modalElement) {
        return;
      }

      let isOutAnimation = animationName.slice(-4) === '-out';
      if (isOutAnimation) {
        modal.remove();
      }
    };

    if (modalElement) {
      modalElement.addEventListener('animationend', animationEnd);
    }
  }

  const removeAnimationListeners = () => {
    if (!animationEnd) {
      return;
    }

    if (modalElement) {
      modalElement.removeEventListener('animationend', animationEnd);
    }

    animationEnd = null;
  }

  export const destroyModal = () => {
    removeFocusTrap(null);
    removeAnimationListeners();

    modal.remove();
  }

  export const closeModal = (result?: unknown) => {
    if (isAnimatingOut) {
      return;
    }

    // This triggers the out animation, which in turn will remove the modal after it completes
    isAnimatingOut = true;

    modal.resolve(result);
  }

  const close = (result: unknown) => {
    closeModal(result);
    removeFocusTrap();
  }
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
  <div data-testid="spm-modal" class="spm-modal" class:spm-out={isAnimatingOut} bind:this={modalElement}>
    <svelte:component this={modal.component} data={modal.data} close={close} />
  </div>
</div>
