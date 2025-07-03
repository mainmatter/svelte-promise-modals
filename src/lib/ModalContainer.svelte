<script lang="ts">
  import { run } from 'svelte/legacy';

  import { onDestroy, onMount } from 'svelte';

  import Modal from './Modal.svelte';
  import { animating, destroyModals, stack, updateOptions } from './service';

  interface Props {
    options?: Record<string, any>;
  }

  let { options = {} }: Props = $props();

  run(() => {
    updateOptions(options);
  });

  onMount(() => {
    let unsubscribeStack = stack.subscribe(($stack) => {
      document.body.classList.toggle('spm-scrolling-disabled', $stack.length > 0);
    });

    let unsubscribeAnimating = animating.subscribe(($animating) => {
      document.body.classList.toggle('spm-animating', $animating);
    });

    return () => {
      unsubscribeStack();
      unsubscribeAnimating();
    };
  });

  onDestroy(destroyModals);
</script>

{#each $stack as modal, _index}
  <Modal {modal} bind:this={modal.componentInstance} />
{/each}
