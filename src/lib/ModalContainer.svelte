<script lang="ts">
  import './svelte-promise-modals.css';

  import Modal from './Modal.svelte';
  import { stack } from './service';
</script>

{#each $stack as modal, index}
  <Modal modal={modal} bind:this={modal.componentInstance} />
{/each}
