import { render, screen, waitFor } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

import FooComponent from './dummy/FooComponent.svelte';
import ModalContainer from './ModalContainer.svelte';
import { open } from './service';

describe('ModalContainer', () => {
  // Looks like there is an issue about components being compiled for SSR in Vitest, so their
  // `onMount` hook isn't working, which is essential to the modal's disappearance
  //
  // https://github.com/sveltejs/vite-plugin-svelte/issues/581
  it.skip('renders', async () => {
    let { container } = render(ModalContainer);

    expect(await screen.queryByTestId('backdrop')).not.toBeInTheDocument();
    expect(await screen.queryByTestId('spm-modal')).not.toBeInTheDocument();
    expect(container).toHaveTextContent('');

    let modal = open(FooComponent, { bar: 'baz' });

    expect(await screen.findAllByTestId('backdrop')).toHaveLength(1);
    expect(await screen.findByTestId('spm-modal')).toHaveTextContent('foo baz');

    modal.close();

    await waitFor(() => {
      expect(screen.queryByTestId('backdrop')).not.toBeInTheDocument();
    });
    expect(await screen.queryByTestId('spm-modal')).not.toBeInTheDocument();
    expect(container).toHaveTextContent('');
  });
});
