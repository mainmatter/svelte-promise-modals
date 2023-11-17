<script lang="ts">
  export let data: Record<string, unknown>;
  export let closeModal: any;
</script>

<button type="button">foo</button>
{data.bar}

<button type="button" on:click={() => closeModal()}>close</button>
