<script lang="ts">
  import type { Modal } from "./modal";

  export let modal: Modal;
</script>

<div data-testid="spm-modal">
  <svelte:component this={modal.component} data={modal.data} />
</div>
