<script lang="ts">
  import { openModal } from '$lib/service';

  import OverlappingTestModal from './OverlappingTestModal.svelte';

  export let foo: string | undefined = undefined;
  export let closeModal: (value?: unknown) => unknown;
</script>

<button type="button">foo</button>
<span data-testid="foo-prop">{foo}</span>

<button type="button" data-testid="show-modal-2" on:click={() => openModal(OverlappingTestModal)}
  >Open another modal</button
>

<button type="button" on:click={() => closeModal(foo)} data-testid="close"> close </button>
