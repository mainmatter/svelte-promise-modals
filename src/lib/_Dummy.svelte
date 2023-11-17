<script lang="ts">
  export let foo: string | undefined;
  export let closeModal: any;
</script>

<button type="button">foo</button>
<span data-testid="foo-prop">{foo}</span>

<button type="button" on:click={() => closeModal()}>close</button>
