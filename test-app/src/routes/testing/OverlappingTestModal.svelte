<script lang="ts">
	interface Props {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		closeModal: any;
	}

	let { closeModal }: Props = $props();
</script>

<div class="modal modal2">
	<header>
		<button type="button" onclick={() => closeModal('x')}>Close</button>
	</header>

	<h2>Modal 2</h2>

	<p>
		Sociis per justo neque pulvinar orci sagittis tristique tincidunt suspendisse cum est, rhoncus
		euismod velit interdum condimentum aenean sed hendrerit arcu venenatis, rutrum commodo elementum
		eros ac at non ullamcorper pellentesque turpis. Tincidunt consequat purus quam ante aliquam
		mattis scelerisque viverra suspendisse, tellus convallis mollis ornare primis penatibus montes
		dapibus sagittis fringilla, magna feugiat conubia luctus posuere suscipit praesent quis.
		Interdum a iaculis aliquet inceptos vulputate torquent dapibus, ultricies nisl congue leo
		molestie eu rutrum lectus, ac non pretium magna ad primis. Cursus dui tempus iaculis nostra
		habitant quis platea hendrerit, purus augue massa elementum dapibus morbi ridiculus, magna
		convallis pretium ac tincidunt inceptos cum.
	</p>
</div>

<style>
	.modal {
		max-width: 400px;
		border-radius: 6px;
		box-shadow: 0 4px 28px 0 rgba(0, 0, 0, 0.36);
		padding: 1.5rem;
	}

	header {
		margin: 0 0 1rem;
	}

	p {
		text-align: left;
	}
</style>
