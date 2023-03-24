import { render, screen, waitFor } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

import FooComponent from './dummy/FooComponent.svelte';
import ModalContainer from './ModalContainer.svelte';
import { openModal } from './service';

describe('Modal', () => {
  it('closeModal() should resolve only once', async () => {
    render(ModalContainer);

    let modal = openModal(FooComponent);
    let spy = vi.spyOn(modal, 'resolve');

    await waitFor(() => {
      expect(screen.queryByTestId('backdrop')).toBeInTheDocument();
    });

    modal.close();

    await waitFor(() => {
      expect(screen.queryByTestId('backdrop')).toHaveClass('spm-backdrop spm-out');
    });

    modal.close();

    expect(spy).toHaveBeenCalledOnce();
  });
});
