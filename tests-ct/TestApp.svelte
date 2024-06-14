<script lang="ts">
  import ModalContainer from '$lib/ModalContainer.svelte';
  import { openModal } from '$lib/service';

  import TestModal from './TestModal.svelte';
  import Wrapper from './Wrapper.svelte';

  let win: any = window;
  win.handle = {} as Record<string, any>;

  let showWrapper = true;

  win.handle.hideWrapper = () => {
    showWrapper = false;
  };

  export let modalContainerOptions = {};
  export let modalProps: any;
  export let openModalOptions = {};
  export let modalContainerCount = 1;

  export let resultCallback = (_: unknown) => {
    /**/
  };

  let errorMessage: string | undefined;

  async function openFooModal() {
    try {
      await openModal(TestModal);
      let result = await openModal(TestModal, modalProps, openModalOptions);
      resultCallback(result);
    } catch (error) {
      errorMessage = (error as Error).toString();
    }
  }
</script>

<button data-testid="open-modal-button" type="button" on:click={() => openFooModal()}>
  Open Modal
</button>

{#if showWrapper}
  <Wrapper let:openModal>
    <button
      on:click={() => openModal(TestModal)}
      data-testid="open-modal-using-context-button"
      type="button"
    >
      Open Using Context
    </button>
  </Wrapper>
{/if}

{#each Array.from({ length: modalContainerCount }) as _}
  <ModalContainer options={modalContainerOptions} />
{/each}

{#if errorMessage}
  <p data-testid="error-message">{errorMessage}</p>
{/if}
