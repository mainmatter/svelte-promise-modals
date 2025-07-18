<script lang="ts">
  import { useModalContext } from 'svelte-promise-modals';
  interface Props {
    children?: import('svelte').Snippet<[any]>;
  }

  let { children }: Props = $props();

  let { openModal } = useModalContext();
</script>

{@render children?.({ openModal, })}
