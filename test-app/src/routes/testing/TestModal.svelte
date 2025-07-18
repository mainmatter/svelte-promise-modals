<script lang="ts">
  import { createOpenModal } from 'svelte-promise-modals';
  import OverlappingTestModal from './OverlappingTestModal.svelte';

  let openModal = createOpenModal();
  interface Props {
    foo?: string | undefined;
    closeModal: (value?: unknown) => unknown;
  }

  let { foo = undefined, closeModal }: Props = $props();
</script>

<div>
<button data-testid="foo-button" type="button">foo</button>
<span data-testid="foo-prop">{foo}</span>

<button type="button" data-testid="show-modal-2" onclick={() => openModal(OverlappingTestModal)}
  >Open another modal</button
>

<button type="button" onclick={() => closeModal(foo)} data-testid="close"> close </button>

  </div>
