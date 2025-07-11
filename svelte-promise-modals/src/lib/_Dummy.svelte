<script lang="ts">
  import type { CloseModalFn } from './types';

  interface Props {
    foo?: string | undefined;
    closeModal: CloseModalFn;
  }

  let { foo = undefined, closeModal }: Props = $props();
</script>

<button type="button">foo</button>
<span data-testid="foo-prop">{foo}</span>

<button type="button" onclick={() => closeModal()}>close</button>
