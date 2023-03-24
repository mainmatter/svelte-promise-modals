<script lang="ts">
  import "./app.css";

  import { browser } from "$app/environment";
  import ModalContainer from "$lib/ModalContainer.svelte";
  import { destroyModals,open } from "$lib/service";

  import FooComponent from "./FooComponent.svelte";
  import logo from './svelte-promise-modals-logo.svg';

  type PlaywrightWindow = Window & {
    modalOptions?: object;
    modalResult?: unknown;
    modals?: unknown;
    destroyModals?: unknown;
  };

  if (browser) {
    (window as PlaywrightWindow).destroyModals = destroyModals;
  }

  let modalOptions = (browser && (window as PlaywrightWindow).modalOptions) || {};

  async function openFooModal() {
    let result = await open(FooComponent);
    (window as PlaywrightWindow).modalResult = result;
  }
</script>

<header>
  <h1>
    <a href="https://github.com/mainmatter/svelte-promise-modals">
      <img src={logo} alt="svelte-promise-modals logo" role="presentation" width="600" height="400" />
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

  <p>See the <a href="https://github.com/mainmatter/svelte-promise-modals#readme" target="_blank" rel="noopener noreferrer">README on GitHub</a> for setup &amp; further instructions.</p>

  <div class="box box-placeholder">
    <p>
      <small>
        Left blank to see <br />how scrolling is handled.
      </small>
    </p>
  </div>

  <p>svelte-promise-modals is <br />made &amp; sponsored with ❤️ by <a href="https://mainmatter.com" target="_blank" rel="noopener noreferrer">Mainmatter</a></p>
</main>

<ModalContainer options={modalOptions} />
