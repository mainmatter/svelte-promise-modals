<script lang="ts">
  import ModalContainer from '$lib/ModalContainer.svelte';
  import { openModal } from '$lib/service';

  import TestModal from './TestModal.svelte';

  export let modalContainerOptions = {};
  export let modalProps: object | undefined;
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

<ModalContainer options={modalContainerOptions} />
