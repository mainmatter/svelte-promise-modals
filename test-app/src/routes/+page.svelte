<script lang="ts">
  import Modal from "$lib/components/Modal.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import { openModal } from 'svelte-promise-modals';
</script>

<button data-testid="open:user-modal" onclick={() => openModal(Modal, { 'data-testid': 'user-modal' })}>
  Open
</button>

<Wrapper />
