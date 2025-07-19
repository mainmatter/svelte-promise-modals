<script lang="ts">
	import { ModalContainer, createOpenModal } from 'svelte-promise-modals';
	import 'svelte-promise-modals/style.css';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import TestModal from './TestModal.svelte';
	import Wrapper from './Wrapper.svelte';

	let openModal = createOpenModal();
	let showWrapper = $state(true);

	const params = $page.url.searchParams;
	const modalProps = params.get('modalProps') ? JSON.parse(params.get('modalProps')!) : {};
	/* eslint-disable @typescript-eslint/no-explicit-any */
	let modalContainerOptions = $state(
		params.get('modalContainerOptions') ? JSON.parse(params.get('modalContainerOptions')!) : {}
	) as any;
	let openModalOptions = $state(
		params.get('openModalOptions') ? JSON.parse(params.get('openModalOptions')!) : {}
	) as any;

	let activateState: unknown = $state();
	let deactivateState: unknown = $state();

	if (params.get('containerOnActivate')) {
		modalContainerOptions = {
			focusTrapOptions: { onActivate: (...args: unknown[]) => (activateState = args) }
		};
	}

	if (params.get('modalOnActivate')) {
		openModalOptions = {
			focusTrapOptions: { onActivate: (...args: unknown[]) => (activateState = args) }
		};
	}

	if (params.get('containerOnDeactivate')) {
		modalContainerOptions = {
			focusTrapOptions: { onDeactivate: (...args: unknown[]) => (deactivateState = args) }
		};
	}

	if (params.get('modalOnDeactivate')) {
		openModalOptions = {
			focusTrapOptions: { onDeactivate: (...args: unknown[]) => (deactivateState = args) }
		};
	}

	if (params.get('modalDisableFocusTrap')) {
		openModalOptions = { focusTrapOptions: null };
	}

	if (params.get('containerDisableFocusTrap')) {
		modalContainerOptions = { focusTrapOptions: null };
	}

	onMount(() => {
		/* eslint-disable @typescript-eslint/no-explicit-any */
		let win: any = window;
		win.handle = {} as Record<string, any>;

		win.handle.hideWrapper = () => {
			showWrapper = false;
		};

		// Store result callback on window for tests to access
		win.resultCallback = (result: unknown) => {
			win.lastModalResult = result;
		};
	});

	async function openFooModal() {
		/* eslint-disable @typescript-eslint/no-explicit-any */
		let result = await openModal(TestModal, modalProps, openModalOptions);
		if (typeof window !== 'undefined') {
			(window as any).resultCallback(result);
		}
	}
</script>

<button data-testid="open-modal-button" type="button" onclick={() => openFooModal()}>
	Open Modal
</button>

{#if showWrapper}
	<Wrapper>
		{#snippet children({ openModal })}
			<button
				onclick={() => openModal(TestModal)}
				data-testid="open-modal-using-context-button"
				type="button"
			>
				Open Using Context
			</button>
		{/snippet}
	</Wrapper>
{/if}

<pre data-testid="focus-trap-activate">
  {JSON.stringify(activateState)}
</pre>
<pre data-testid="focus-trap-deactivate">
  {JSON.stringify(deactivateState)}
</pre>

<!-- eslint-disable-next-line -->
<ModalContainer options={modalContainerOptions} />
