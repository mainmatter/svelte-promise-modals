<script lang="ts">
  import { ModalContainer, createOpenModal } from 'svelte-promise-modals';
	import 'svelte-promise-modals/style.css';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import TestModal from './TestModal.svelte';
  import Wrapper from './Wrapper.svelte';

  let openModal = createOpenModal();
  let showWrapper = $state(true);

  // Get props from URL search params
  const params = $page.url.searchParams;
  const modalContainerOptions = params.get('modalContainerOptions') ? JSON.parse(params.get('modalContainerOptions')!) : { };
  const modalProps = params.get('modalProps') ? JSON.parse(params.get('modalProps')!) : {};
  const openModalOptions = params.get('openModalOptions') ? JSON.parse(params.get('openModalOptions')!) : {};

  onMount(() => {
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

<ModalContainer options={modalContainerOptions} />
