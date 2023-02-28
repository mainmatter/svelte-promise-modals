<script>
  import ModalContainer from "$lib/ModalContainer.svelte";
  import { open } from "$lib/service";

  import FooComponent from "./FooComponent.svelte";
</script>

<ModalContainer />

<button type="button" on:click={() => open(FooComponent)}>Open</button>
