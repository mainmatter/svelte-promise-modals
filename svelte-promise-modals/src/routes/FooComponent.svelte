<script lang="ts">
  import { openModal } from '$lib/service.svelte';

  import BarComponent from './BarComponent.svelte';

  interface Props {
    data: unknown;
    closeModal: any;
  }

  let { data, closeModal }: Props = $props();
</script>

<div class="modal modal1" data-test-modal-wrap>
  <header>
    <button type="button" data-testid="close" class="mt-0" onclick={() => closeModal()}>
      Close
    </button>
  </header>

  <h2>Hey, I'm a modal!</h2>

  <p>
    Please use me in your web application as a quick way to get your user's attention. You can use
    me to inform your users about important announcements and noteworthy updates. You can also
    direct them to the most important actions or places within your web application! To do this, you
    can equip me with links and buttons like the one below this text that I'm currently presenting
    to YOU, since you're the one using this very website. Thanks for trying me out!
  </p>

  <p>
    <button type="button" data-testid="show-modal-2" onclick={() => openModal(BarComponent)}
      >Open another modal</button
    >
  </p>

  <p>
    I have a wonderful feature that allows you and your users to concentrate fully on the content I
    am displaying. I am elevated and blur and darken everything else on the page, ensuring that your
    user concentrates on everything displayed in my body. This is a great way to make sure your user
    gets all the information you want them to.
  </p>

  <p>
    You may have noticed that I'm a rather chatty modal. That's because I want to make sure that you
    have enough readable content to notice that I'm scrollable. So, if you have more content than
    will fit in the height of the viewport, your user can simply scroll, as they're used to doing in
    a normal web application. Your users will love this, I promise!
  </p>

  <p>
    <button type="button" data-test-submit onclick={() => closeModal({ returnData: data })}
      >Close with return data</button
    >
  </p>
</div>

<style>
  .modal {
    max-width: 600px;
    border-radius: 6px;
    background-color: white;
    box-shadow: 0 4px 28px 0 rgba(0, 0, 0, 0.36);
    padding: 1.5rem;
  }

  .modal h2 {
    text-align: start;
  }

  header {
    margin: 0 0 1rem;
  }

  p {
    text-align: left;
  }
</style>
