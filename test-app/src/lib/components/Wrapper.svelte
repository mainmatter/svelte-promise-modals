<script lang="ts">
  import Modal from "$lib/components/Modal.svelte";
  import { openModal } from 'svelte-promise-modals';
</script>

<button data-testid="open:inner-modal" onclick={() => openModal(Modal)}>
  Open
</button>
