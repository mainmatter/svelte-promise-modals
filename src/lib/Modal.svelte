<script lang="ts">
  import './svelte-promise-modals.css';

  import { onDestroy, onMount } from "svelte";

  import type { Modal } from "./modal";

  type AnimationEndHandler = GlobalEventHandlers['onanimationend'];

  export let modal: Modal;

  let isAnimatingOut = false;
  let modalElement: HTMLElement;
  let animationEnd: AnimationEndHandler | null = null;

  onMount(async () => {
    addAnimationListeners();
  });

  onDestroy(() => {
    destroyModal();
  });

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
    removeAnimationListeners();

    modal.remove();
  }

  export const closeModal = (result: unknown) => {
    if (isAnimatingOut) {
      return;
    }

    // This triggers the out animation, which in turn will remove the modal after it completes
    isAnimatingOut = true;

    modal.resolve(result);
  }

  const close = (result: unknown) => {
    closeModal(result);
  }
</script>


<div data-testid="backdrop" class="spm-backdrop" class:spm-out={isAnimatingOut}>
  <div data-testid="spm-modal" class="spm-modal" class:spm-out={isAnimatingOut} bind:this={modalElement}>
    <svelte:component this={modal.component} data={modal.data} close={close} />
  </div>
</div>
