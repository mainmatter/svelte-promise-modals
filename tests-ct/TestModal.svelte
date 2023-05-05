<script lang="ts">
  import { openModal } from '$lib/service';

  import OverlappingTestModal from './OverlappingTestModal.svelte';

  export let data: Record<string, unknown> | undefined;
  export let close: (...args: unknown[]) => unknown;
</script>

<button type="button">foo</button>
{JSON.stringify(data)}

<button type="button" data-testid="show-modal-2" on:click={() => openModal(OverlappingTestModal)}
  >Open another modal</button
>

<button type="button" on:click={() => close(data)} data-testid="close"> close </button>
