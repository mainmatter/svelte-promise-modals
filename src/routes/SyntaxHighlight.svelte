<script>
  // `import Prism` must come *before* `import 'prism-svelte'`
  // eslint-disable-next-line simple-import-sort/imports
  import Prism from 'prismjs';
  import 'prism-svelte';
  import './prism-promisemodals.css';

  export let code = '';

  $: highlighted = Prism.highlight(code, Prism.languages.svelte, 'svelte');
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<pre class="language-svelte"><code>{@html highlighted}</code></pre>

<style>
  pre {
    border-radius: 1rem;
    font-size: 1rem;
  }
</style>
