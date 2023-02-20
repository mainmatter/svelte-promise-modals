import { get } from 'svelte/store';
import { afterEach, describe, expect, it } from 'vitest';

import { count, open, stack, top } from './service';

describe('Service', () => {
  afterEach(() => {
    stack.set([]);
  });

  it('basics', () => {
    expect(get(count), '#count').toBe(0);
    expect(get(top), '#top').toBe(undefined);

    let modal1 = open({}, { foo: 'bar' });
    expect(get(count), '#count').toBe(1);
    expect(get(top), '#top').toBe(modal1);

    let modal2 = open({});
    expect(get(count), '#count').toBe(2);
    expect(get(top), '#top').toBe(modal2);

    modal2.remove();
    expect(get(count), '#count').toBe(1);
    expect(get(top), '#top').toBe(modal1);

    modal1.remove();
    expect(get(count), '#count').toBe(0);
    expect(get(top), '#top').toBe(undefined);
  });

  it('modals can have results', () => {
    let modal = open({});
    expect(modal.result).toBe(undefined);

    modal.resolve('foo');
    expect(modal.result).toBe('foo');

    modal.remove();
  });
});
