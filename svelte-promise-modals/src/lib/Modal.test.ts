import { render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';

import _Dummy from './_Dummy.svelte';
import ModalContainer from './ModalContainer.svelte';
import { destroyModals, openModal } from './service';

describe('Modal', () => {
  afterEach(() => {
    destroyModals();
  });

  it('closeModal() should resolve only once', async () => {
    render(ModalContainer);

    let modal = openModal(_Dummy);
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

  it('passes the props to the component', async () => {
    render(ModalContainer);

    openModal(_Dummy, { foo: 'bar' });

    await waitFor(() => {
      expect(screen.queryByTestId('foo-prop')).toHaveTextContent('bar');
    });
  });
});
