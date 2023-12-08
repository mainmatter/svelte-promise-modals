<script lang="ts">
  import '$lib/style.css';
  import './app.css';

  import ModalContainer from '$lib/ModalContainer.svelte';
  import { openModal } from '$lib/service';
  import type { ModalOptions } from '$lib/types';

  import FooComponent from './FooComponent.svelte';
  import logo from './svelte-promise-modals-logo.svg';

  async function openFooModal(options?: ModalOptions) {
    let result = await openModal(FooComponent, null, options);
    console.log(`Modal result: ${JSON.stringify(result)}`);
  }
</script>

<svelte:head>
  <script
    defer
    data-domain="svelte-promise-modals.com"
    src="https://plausible.io/js/script.js"
  ></script>
</svelte:head>

<header>
  <h1>
    <a href="https://github.com/mainmatter/svelte-promise-modals">
      <img
        src={logo}
        alt="svelte-promise-modals logo"
        role="presentation"
        width="600"
        height="400"
      />
      <span class="visually-hidden">svelte-promise-modals</span>
    </a>
  </h1>
</header>

<main>
  <div class="box box-blue">
    <p>
      <button type="button" on:click={() => openFooModal()} data-testid="open-foo">
        A simple modal with a button to close it
      </button>
    </p>
  </div>

  <p>
    See the <a
      href="https://github.com/mainmatter/svelte-promise-modals#readme"
      target="_blank"
      rel="noopener noreferrer">README on GitHub</a
    > for setup &amp; further instructions.
  </p>

  <div class="box box-placeholder">
    <p>
      <small>
        Left blank to see <br />how scrolling is handled.
      </small>
    </p>
  </div>

  <p>
    svelte-promise-modals is <br />made &amp; sponsored with ❤️ by
    <a href="https://mainmatter.com" target="_blank" rel="noopener noreferrer">Mainmatter</a>
  </p>
</main>

<ModalContainer />
