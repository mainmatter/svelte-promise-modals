<script lang="ts">
  import Modal from './Modal.svelte';
  import { stack } from './service';
</script>

{#each $stack as modal, index}
  <div data-testid="backdrop">
    <Modal modal={modal} bind:this={modal.componentInstance} />
  </div>
{/each}