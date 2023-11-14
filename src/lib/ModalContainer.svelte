<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import Modal from './Modal.svelte';
  import { animating, destroyModals, stack, updateOptions } from './service';

  export let options: Record<string, any> = {};

  $: updateOptions(options);

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
