<script lang="ts">
  import { type CloseModalFn } from 'svelte-promise-modals';

  interface Props {
    closeModal: CloseModalFn
  }

  let { closeModal }: Props = $props();

</script>

<div data-testid="user-modal">
  Hi, I'm User Modal.

  <button onclick={() => closeModal()} data-testid="close:user-modal">Close</button>
</div>
