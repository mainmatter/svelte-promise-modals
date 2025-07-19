# Svelte Promise Modals

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
    let modal = openModal(SomeComponent);

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

Passing data to the component rendered as a modal is done via props like so:

```js
openModal(FilePreview, {
  fileUrl: 'http://example.com/some-file.pdf',
});
```

Each key of the object is just a regular prop:

```svelte
<!-- FilePreview.svelte -->
<script>
  export let fileUrl;
</script>

<img src={fileUrl} />
```

**NOTE:** By default, a `closeModal` function is passed in your rendered component, in order to trigger
the "close modal" action. It can be called like so:

```svelte
<!-- FilePreview.svelte -->
<script>
  export let closeModal;
</script>

<button type="button" on:click={() => closeModal('some result')}>Close</button>
```

### TypeScript

In order to make sure you don't pass something other to `closeModal` than expected, you can specify
its value param type in your modal component using the `CloseModalFn<T>` type, such as:

```svelte
<!-- MyModal.svelte -->
<script lang="ts">
  import type { CloseModalFn } from 'svelte-promise-modals';
  export let closeModal: CloseModalFn<string>;

  function handleClose() {
    closeModal('foo');
  }
</script>
```

Then when you open the modal, it'll correctly infer the type of the result:

```svelte
<script lang="ts">
  import { openModal } from 'svelte-promise-modals';
  import MyModal from './MyModal.svelte';

  async function handleOpenModal() {
    // You can specify `string` here, but it's also automatically inferred
    let result: string = openModal(MyModal);
  }
</script>
```

If you don't pass a type parameter to `CloseModalFn`, it means you won't be passing anything to
`closeModal`, such as:

```typescript
// This means you can only call `closeModal();` without params
export let closeModal: CloseModalFn;
```

And the `result` will be `undefined`:

```typescript
let result: undefined = await openModal(MyModal);
```

Last, but not least, you can omit `closeModal` entirely, but then you'll have to close the modal
from when you opened it.

### Destroying the component

It's worth noting that since modals are opened as a descendant of `ModalContainer`, and therefore
likely placed at the root layout, when the component the modal was opened from gets destroyed, such
as when navigating away from a route, the modal will continue to live on. To automatically destroy
the modal in such cases, create a modal context first, then use its `openModal` function instead of
the one exported from the package. Modal context's `openModal` function hooks into `onDestroy`,
ensuring all modals opened from that specific component gets destroyed when the component is
unrendered.

```svelte
<script>
  import { useModalContext } from 'svelte-promise-modals';

  let { openModal } = useModalContext();

  async function handleOpenModal() {
    let result = await openModal(FooModal);
    // The modal will get destroyed if the component is destroyed
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
a custom `className` can be handed to the `openModal()` method.

```js
openModal(
  FilePreview,
  {
    fileUrl: 'http://example.com/some-file.pdf',
  },
  {
    // custom class, see below for example
    className: 'custom-modal',
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

In order to speed up modal in/out animations during testing, either:

- Switch to reduced motion, for ex. in Playwright:  
   `await page.emulateMedia({ reducedMotion: 'reduce' });`
- Include the [testing.css](./src/lib/testing.css) into your app that will do the same thing

## Contributing

Once you've cloned the project and installed dependencies with `pnpm install`, start a development server:

- `pnpm -F svelte-promise-modals dev` Running https://svelte-promise-modals.com/ website
- `pnpm -F test-app dev` Running the `test-app` which contains modal testing scenarios. Also used for automated testing using Playwright, including Visual testing.
- `pnpm test` Run Unit and E2E tests.
- `pnpm -F test-app test:e2e` Run only E2E tests
- `pnpm test:visual` Run only E2E tests inside docker *preferred* method to make sure screenshots are consistent across platforms.

```bash
pnpm -F svelte-promise-modals dev

# or start the server and open the app in a new browser tab
pnpm -F svelte-promise-modals dev -- --open
```



## License

svelte-promise-modals is developed by and © Mainmatter GmbH and contributors. It is released under
the [MIT License](LICENSE.md).
