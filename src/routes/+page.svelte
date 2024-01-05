<script lang="ts">
  import '$lib/style.css';
  import './app.css';

  import dedent from 'dedent';

  import ModalContainer from '$lib/ModalContainer.svelte';
  import { openModal } from '$lib/service';
  import type { ModalOptions } from '$lib/types';

  import crossedFingers from './assets/Crossedfingers.svg';
  import heartFace from './assets/Heartface.svg';
  import mainmatter from './assets/Mainmatter.svg';
  import redHeart from './assets/Redheart.svg';
  import yellowHeart from './assets/Yellowheart.svg';
  import FooComponent from './FooComponent.svelte';
  import SyntaxHighlight from './SyntaxHighlight.svelte';

  async function openFooModal(options?: ModalOptions) {
    let result = await openModal(FooComponent, null, options);
    console.log(`Modal result: ${JSON.stringify(result)}`);
  }
</script>

<svelte:head>
  <title>Svelte Promise Modals 🤞</title>
  <script
    defer
    data-domain="svelte-promise-modals.com"
    src="https://plausible.io/js/script.js"
  ></script>
</svelte:head>

<header>
  <div>
    <img
      src={crossedFingers}
      alt="An emoji showing crossed fingers"
      role="presentation"
      id="crossedfingers"
    />
    <span class="visually-hidden">svelte-promise-modals</span>
  </div>
  <h1>
    <span class="svelte">Svelte</span><span class="translateNeg">Promise</span><span
      class="translatePos">Modals</span
    >
  </h1>
</header>

<main>
  <div class="preview">
    <h2>Example for <strong>the modal</strong></h2>
    <button type="button" on:click={() => openFooModal()} data-testid="open-foo">
      A simple modal with a button to close it
    </button>
  </div>

  <SyntaxHighlight
    code={dedent`
      <script>
        import { openModal } from 'svelte-promise-modals';

        async function openFooModal() {
          let result = await openModal(FooComponent);
          console.log(result); // Whatever the modal returned when it was closed
        }
      </script>

      <button type="button" on:click={() => openFooModal()}>
        A simple modal with a button to close it
      </button>
  `}
  />

  <div class="preview">
    <h2>Example for <strong>custom animations</strong></h2>
    <button type="button" on:click={() => openFooModal()} data-testid="open-foo">
      From and to the bottom of the window
    </button>
    <button type="button" on:click={() => openFooModal()} data-testid="open-foo">
      From and to the bottom of the window
    </button>
  </div>

  <div class="note">
    <p>
      Code for the demonstrations shown here can be found in the <a
        href="https://github.com/mainmatter/svelte-promise-modals/tree/master/src/routes"
        >demo application</a
      > of the addon.
    </p>

    <p>
      See the <a
        href="https://github.com/mainmatter/svelte-promise-modals#readme"
        target="_blank"
        rel="noopener noreferrer">README</a
      > on GitHub for setup &amp; further instructions.
    </p>
  </div>

  <div>
    <img src={redHeart} alt="A red heart" role="presentation" id="redheart" />
  </div>

  <div class="note">
    <p>
      svelte-promise-modals is <br />made &amp; sponsored with ❤️ by
      <a href="https://mainmatter.com" target="_blank" rel="noopener noreferrer">
        <div>
          <img src={mainmatter} alt="Mainmatter" role="presentation" id="mainmatter" />
        </div></a
      >
    </p>
  </div>

  <div>
    <img
      src={yellowHeart}
      alt="yellow heart"
      role="presentation"
      id="yellowheart"
      class="floating"
    />
  </div>

  <div>
    <img
      src={heartFace}
      alt="smiley face surrounded by hearts"
      role="presentation"
      id="heartface"
      class="floating"
    />
  </div>
</main>

<ModalContainer />
