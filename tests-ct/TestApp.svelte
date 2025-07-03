<script lang="ts">
  import ModalContainer from '$lib/ModalContainer.svelte';
  import { openModal } from '$lib/service';

  import TestModal from './TestModal.svelte';
  import Wrapper from './Wrapper.svelte';

  let win: any = window;
  win.handle = {} as Record<string, any>;

  let showWrapper = $state(true);

  win.handle.hideWrapper = () => {
    showWrapper = false;
  };


  interface Props {
    modalContainerOptions?: any;
    modalProps: any;
    openModalOptions?: any;
    resultCallback?: any;
  }

  let {
    modalContainerOptions = {},
    modalProps,
    openModalOptions = {},
    resultCallback = (_: unknown) => {
    /**/
  }
  }: Props = $props();

  async function openFooModal() {
    let result = await openModal(TestModal, modalProps, openModalOptions);
    resultCallback(result);
  }
</script>

<button data-testid="open-modal-button" type="button" onclick={() => openFooModal()}>
  Open Modal
</button>

{#if showWrapper}
  <Wrapper >
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
