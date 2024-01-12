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

  export let resultCallback = (_: unknown) => {
    /**/
  };

  async function openFooModal() {
    let result = await openModal(TestModal, modalProps, openModalOptions);
    resultCallback(result);
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

<ModalContainer options={modalContainerOptions} />
