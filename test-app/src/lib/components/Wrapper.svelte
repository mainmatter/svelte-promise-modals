<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import FormModal from '$lib/components/FormModal.svelte';
	import { createOpenModal } from 'svelte-promise-modals';

	let openModal = createOpenModal();

	let modalResult: unknown = $state(null);
</script>

<button data-testid="open:inner-modal" onclick={() => openModal(Modal)}> Open </button>

<button
	data-testid="open:save-user-modal"
	onclick={async () => (modalResult = await openModal(FormModal, { id: 'a-b-c' }))}
>
	Open with result
</button>

<pre data-testid="output:user-modal">
  {JSON.stringify(modalResult, null, 2)}
</pre>
