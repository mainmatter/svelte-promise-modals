<script lang="ts">
  import 'svelte-promise-modals/style.css';
  import Modal from "$lib/components/Modal.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { ModalContainer, openModal } from 'svelte-promise-modals';
</script>

<button data-testid="open:user-modal" onclick={() => openModal(Modal, { 'data-testid': 'user-modal' })}>
  Open
</button>

<Wrapper />

<ModalContainer />
