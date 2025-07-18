<script lang="ts">
  import { type CloseModalFn } from 'svelte-promise-modals';

  interface Props {
    closeModal: CloseModalFn<{ id: string, name: string }>,
    id: string;
  }

  let { closeModal, id }: Props = $props();

</script>

<div data-testid="save-user-modal">
  Hi, I'm User Save Modal.

  <button onclick={() => closeModal({ id, name: "Saved user" })} data-testid="save:user-modal">Save</button>
</div>
