import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

import FooComponent from './dummy/FooComponent.svelte';
import ModalContainer from './ModalContainer.svelte';
import { open } from './service';

describe('ModalContainer', () => {
  it('renders', async () => {
    let { container } = render(ModalContainer);

    expect(await screen.queryByTestId('backdrop')).not.toBeInTheDocument();
    expect(await screen.queryByTestId('spm-modal')).not.toBeInTheDocument();
    expect(container).toHaveTextContent('');

    let modal = open(FooComponent, { bar: 'baz' });

    expect(await screen.findAllByTestId('backdrop')).toHaveLength(1);
    expect(await screen.findByTestId('spm-modal')).toHaveTextContent('foo baz');

    modal.close();

    expect(await screen.queryByTestId('backdrop')).not.toBeInTheDocument();
    expect(await screen.queryByTestId('spm-modal')).not.toBeInTheDocument();
    expect(container).toHaveTextContent('');
  });
});
