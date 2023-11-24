<script lang="ts">
  import type { CloseModalFn } from './types';

  export let foo: string | undefined = undefined;
  export let closeModal: CloseModalFn;
</script>

<button type="button">foo</button>
<span data-testid="foo-prop">{foo}</span>

<button type="button" on:click={() => closeModal()}>close</button>
