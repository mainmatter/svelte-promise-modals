<script lang="ts">
	import { createOpenModal } from 'svelte-promise-modals';
	interface Props {
		/* eslint-disable @typescript-eslint/no-explicit-any */
		children?: import('svelte').Snippet<[any]>;
	}

	let { children }: Props = $props();

	let openModal = createOpenModal();
</script>

{@render children?.({ openModal })}
