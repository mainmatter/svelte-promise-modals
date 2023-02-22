import type { ComponentType } from 'svelte';
import { get } from 'svelte/store';
import { afterEach, describe, expect, it } from 'vitest';

import { count, open, stack, top } from './service';

describe('Service', () => {
  afterEach(() => {
    stack.set([]);
  });

  // We don't need real components here, any object we can uniquely reference to will do
  let Component = {} as ComponentType;

  it('basics', () => {
    expect(get(count), '#count').toBe(0);
    expect(get(top), '#top').toBe(undefined);

    let modal1 = open(Component, { foo: 'bar' });
    expect(get(count), '#count').toBe(1);
    expect(get(top), '#top').toBe(modal1);

    let modal2 = open(Component);
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
    let modal = open(Component);
    expect(modal.result).toBe(undefined);

    modal.resolve('foo');
    expect(modal.result).toBe('foo');

    modal.remove();
  });

  it('modals are promises', async () => {
    let modal = open(Component);
    let steps: string[] = [];

    modal.then(() => {
      steps.push('then');
    });

    expect(steps).toMatchObject([]);

    modal.resolve('foo');

    let result = await modal;

    expect(steps).toMatchObject(['then']);
    expect(result).toBe('foo');
  });

  it('modals do not show up in openCount when closing', () => {
    let modal = open(Component);

    expect(get(count)).toBe(1);

    modal.resolve();

    expect(get(count)).toBe(0);

    modal.remove();

    expect(get(count)).toBe(0);
  });

  it('modals will call the optional onAnimationModalOutEnd hook when it is passed as an option', async () => {
    let steps = [];

    let modal = open(
      Component,
      {},
      {
        onAnimationModalOutEnd: () => {
          steps.push('animation ended');
        },
      }
    );

    steps.push('modal open');

    modal.resolve();
    steps.push('modal closing');

    modal.remove();
    steps.push('modal closed');

    // we need to wait a tick for the closing animation promise to be resolved
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    expect(steps).toMatchObject(['modal open', 'modal closing', 'modal closed', 'animation ended']);
  });
});
