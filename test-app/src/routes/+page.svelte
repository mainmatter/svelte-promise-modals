<script lang="ts">
	import 'svelte-promise-modals/style.css';
	import Modal from '$lib/components/Modal.svelte';
	import Wrapper from '$lib/components/Wrapper.svelte';
	import { ModalContainer, openModal } from 'svelte-promise-modals';

	let showWrapper = $state(true);
</script>

<button
	data-testid="open:user-modal"
	onclick={() => openModal(Modal, { 'data-testid': 'user-modal' })}
>
	Open
</button>

<div class="test-container">
	<h3>Wrapper</h3>

	{#if showWrapper}
		<Wrapper />
	{/if}

	<button data-testid="toggle:wrapper-visibility" onclick={() => (showWrapper = !showWrapper)}>
		Toggle wrapper
	</button>
</div>

<ModalContainer />

<style>
	.test-container {
		border: medium;
		border-style: solid;
	}
</style>
