<script lang="ts">
  export let data: Record<string, unknown> | undefined;
  export let close: (...args: unknown[]) => unknown;
</script>

<button type="button">foo</button>
{JSON.stringify(data)}

<button type="button" on:click={() => close(data)} data-testid="close"> close </button>
