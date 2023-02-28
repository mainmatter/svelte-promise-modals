<script lang="ts">
  export let data: Record<string, unknown>;
  export let close: any;
</script>

<button type="button">foo</button>
{data.bar}

<button type="button" on:click={() => close()}>close</button>
