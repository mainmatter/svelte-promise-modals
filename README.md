<p align="center"><h1>🤞</h1></p>

# svelte-promise-modals

The better way to handle modals in your Svelte apps. Promised! 🤞

> [!NOTE]
> svelte-promise-modals was written and is maintained by [Mainmatter](https://mainmatter.com) and contributors.
> We offer consulting, training, and team augmentation for Svelte & SvelteKit – check out our
> [website](https://mainmatter.com/svelte-consulting/) to learn more!

## Compatibility

- Svelte v3 or above
- Node v16 or above

## Installation

```
npm install --save-dev svelte-promise-modals
```

## Usage

To use SPM in your project, add the target for the modals to your root template:

```svelte
<!-- Eg. in SvelteKit: src/routes/+layout.svelte -->
<script>
  import 'svelte-promise-modals/style.css';
  import { ModalContainer } from 'svelte-promise-modals';
</script>

<slot />

<ModalContainer />
```

Then you can import the `openModal` function wherever you need it and call with a component reference to
render it as a modal.

```svelte
<script>
  import { openModal } from 'svelte-promise-modals';
  import SomeComponent from './SomeComponent.svelte';

  async function handleOpenModal() {
    let modal = openModal(FooModal);

    // the instance acts as a promise that resolves with anything passed to the close function
    modal.then((result) => {
      // do something with the data
    });

    // so does `await`ing it!
    let result = await modal;

    // you can also close the modal from outside
    modal.close();
  }
</script>

<button type="button" on:click={handleOpenModal}>Open "SomeComponent" as a modal</button>
```

### Passing data to the rendered component

You can pass custom data into your rendered template like so:

```js
openModal(FilePreview, {
  fileUrl: 'http://example.com/some-file.pdf',
});
```

All passed attributes can be accessed from the passed-in `data` object:

```svelte
<!-- FilePreview.svelte -->
<script>
  export let data;
</script>

<img src={data.fileUrl} />
```

**NOTE:** By default, a `close` function is passed in your rendered component, in order to trigger
the "close modal" action. It can be called like so:

```svelte
<!-- FilePreview.svelte -->
<script>
  export let close;
</script>

<button type="button" on:click={() => close('some result')}>Close</button>
```

### Destroying the component

It's woth noting that since modals are opened as a descendant of `ModalContainer`, and therefore
likely placed at the root layout, when the component the modal was opened from gets destroyed, such
as when navigating away from a route, the modal will continue to live on. To automatically destroy
the modal in such cases, use the `onDestroy` hook:

```svelte
<script>
  import { onDestroy } from 'svelte';

  async function handleOpenModal() {
    let modal = openModal(FooModal);

    onDestroy(() => {
      modal.close();
    });

    let result = await modal;
  }
</script>
```

## Animation

This addon uses CSS animations. You can either replace the [styles of this
package](./src/lib/style.css) with your own or adjust the defaults using CSS custom properties in
your `:root{}` declaration or in the CSS of any parent container of `<ModalContainer />`.

Available properties and their defaults can be found in the `:root {}` block inside the package CSS.

By default, the animations are dropped when `prefers-reduced-motion` is detected.

### Custom animations

To override the animation for a specific modal, an `options` object containing
a custom `className` can be handed to the `.open()` method.

```js
openModal(
  FilePreview,
  {
    fileUrl: 'http://example.com/some-file.pdf',
  },
  {
    // custom class, see below for example
    className: 'custom-modal',
    // optional: name the animation triggered by the custom CSS class
    //           animations ending in "-out" are detected by default!
    //           You most likely do not have to do this unless you absolutely
    //           can't have an animation ending in '-out'
    animationKeyframesOutName: 'custom-animation-name-out',
    // optional: a hook that is called when the closing animation of
    //           the modal (so not the backdrop) has finished.
    onAnimationModalOutEnd: () => {},
  }
);
```

```css
.custom-modal {
  animation: custom-animation-in 0.5s;
  opacity: 1;
  transform: translate(0, 0);
}

/* 
  The `.spm-out` class is added to the parent of the modal when the modal 
  should be closed, which triggers the animation
*/
.custom-modal.spm-out {
  animation: custom-animation-name-out 0.2s; /* default out animation is 2s */
  opacity: 0;
  transform: translate(0, 100%);
}

/* 
  animation name has to end in "-out" to be detected by the custom animationend 
  event handler 
*/
@keyframes custom-animation-name-out {
  0% {
    opacity: 1;
    transform: translate(0, 0);
  }
  100% {
    opacity: 0;
    transform: translate(0, 100%);
  }
}
```

The CSS animations which are applied by the custom CSS class _must_ end in `-out` to make the
animations trigger the modal removal.

#### Examples

Examples for custom animations and how to apply them can be found in the addons dummy application.

See [index route](./src/routes/+page.svelte) for how the modals are openend in and look at
[app.css](./src/routes/app.css) for the style definition of these custom animations.

### CSS Variables

Use the below CSS variables to override the defaults:

```css
--spm-animation-backdrop-in-duration;
--spm-animation-backdrop-out-duration;
--spm-animation-modal-in-duration;
--spm-animation-modal-out-duration;
--spm-animation-backdrop-in-delay;
--spm-animation-backdrop-out-delay;
--spm-animation-modal-in-delay;
--spm-animation-modal-out-delay;
--spm-animation-backdrop-in;
--spm-animation-backdrop-out;
--spm-animation-modal-in;
--spm-animation-modal-out;
--spm-backdrop-background;
```

For th

## Accessibility

User can press the <kbd>Esc</kbd> key to close the modal.

SPM uses [focus-trap](https://github.com/davidtheclark/focus-trap) internally to handle user focus.

SPM will ensure to [focus the first "tabbable element" by default](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal).
If no focusable element is present, focus will be applied on the currently visible auto-generated
container for the current modal.

Focus Trap can be configured both on the `<ModalContainer />` component, and the individual modal
level when calling `openModal()`. Global and local options are used in that order, which means that
local config take precedence.

To set global Focus Trap config that all modals inherit, provide the `focusTrapOptions` property to
the `<ModalContainer />` component:

```svelte
<ModalContainer
  options={{
    focusTrapOptions: {
      clickOutsideDeactivates: false,
    },
  }}
/>
```

Example for local Focus Trap option, when opening a specific modal:

```js
openModal(
  FilePreview,
  { fileUrl: 'http://example.com/some-file.pdf' },
  {
    focusTrapOptions: {
      clickOutsideDeactivates: false,
    },
  }
);
```

To disable Focus Trap completely, set `focusTrapOptions` to `null` on the `<ModalContainer />`:

```svelte
<ModalContainer
  options={{
    focusTrapOptions: null,
  }}
/>
```

Or when opening a modal:

```js
openModal(
  FilePreview,
  { fileUrl: 'http://example.com/some-file.pdf' },
  {
    focusTrapOptions: null,
  }
);
```

⚠️ _We strongly advise against doing this. This will in most cases worsen the
accessibility of modals for your users. Be very careful._

## Testing

In order to speed up modal in/out animations duriung testing, either:

- Switch to reduced motion, for ex. in Playwright:  
   `await page.emulateMedia({ reducedMotion: 'reduce' });`
- Include the [testing.css](./src/lib/testing.css) into your app that will do the same thing

## Contributing

Once you've cloned the project and installed dependencies with `pnpm install`, start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## License

This project is licensed under the [MIT License](LICENSE.md).
