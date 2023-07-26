<script lang="ts">
  import './svelte-promise-modals.css';

  import Modal from './Modal.svelte';
  import { stack, updateOptions } from './service';

  export let options: Record<string, any> = {};

  $: updateOptions(options);
</script>

{#each $stack as modal, _index}
  <Modal {modal} bind:this={modal.componentInstance} />
{/each}
