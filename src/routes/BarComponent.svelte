<script lang="ts">
  export let closeModal: any;
</script>

<div class="modal modal2">
  <header>
    <button type="button" class="mt-0" on:click={() => closeModal('x')}>Close</button>
  </header>

  <h2>Hi, I'm another modal!</h2>

  <p>
    I just wanted to say hi too, and let you know that you can even have nested modals. We're not
    sure how many use cases you'll find for me, but I hope you don't mind me letting you know it's
    possible! More options are always fun, right? And if you don't need me, I'll just chill here,
    hidden away forever... That's fine with me, I promise!
  </p>
</div>

<style>
  .modal {
    max-width: 400px;
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
