<script lang="ts">
  import '$lib/style.css';
  import './app.css';

  import ModalContainer from '$lib/ModalContainer.svelte';
  import { openModal } from '$lib/service';
  import type { ModalOptions } from '$lib/types';

  import FooComponent from './FooComponent.svelte';
  import crossedFingers from './assets/Crossedfingers.svg';
  import redHeart from './assets/Redheart.svg';
  import yellowHeart from './assets/Yellowheart.svg';
  import heartFace from './assets/Heartface.svg';
  import mainmatter from './assets/Mainmatter.svg';

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
  <a href="https://github.com/mainmatter/svelte-promise-modals">
    <div>
      <img
        src={crossedFingers}
        alt="An emoji showing crossed fingers"
        role=""
        id ="crossedfingers"
      />
      <span class="visually-hidden">svelte-promise-modals</span>
    </div>
    <h1><span class="svelte">Svelte</span><span class="translateNeg">Promise</span><span class="translatePos">Modals</span></h1>
    </a>
  </header>

<main>
  <div class="preview">
    <h2>Example for <strong>the modal</strong></h2>
    <button type="button" on:click={() => openFooModal()} data-testid="open-foo">
        A simple modal with a button to close it
    </button>
    <p>Code for the demonstrations shown here can be found in the dummy application of the addon.</p>
  </div>

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
      See the <a
        href="https://github.com/mainmatter/svelte-promise-modals#readme"
        target="_blank"
        rel="noopener noreferrer">README</a> on GitHub for setup &amp; further instructions.
    </p>
  </div>

  <div>
    <img
      src={redHeart}
      alt="A red heart"
      role=""
      id="redheart"
    />
  </div>

  <div class="note">
    <p>
      svelte-promise-modals is <br />made &amp; sponsored with ❤️ by
      <a href="https://mainmatter.com" target="_blank" rel="noopener noreferrer">
        <div>
        <img
          src={mainmatter}
          alt="Mainmatter"
          role=""
          id="mainmatter"
        />
      </div></a>
    </p>
  </div>

  <div>
    <img
          src={yellowHeart}
          alt="yellow heart"
          role=""
          id="yellowheart"
          class="floating"
        />
  </div>

  <div>
    <img
          src={heartFace}
          alt="smiley face surrounded by hearts"
          role=""
          id="heartface"
          class="floating"
        />
  </div>

</main>
<footer>
  
  <p>
    Ember Promise Modals is not an official part of Ember.js
    and is not maintained by the Ember.js Core Team.
  </p>
  
</footer>

<ModalContainer />
