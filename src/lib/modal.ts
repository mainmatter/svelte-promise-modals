import type RSVP from 'rsvp';
import { defer } from 'rsvp';
import type { ComponentType, SvelteComponentTyped } from 'svelte';

import { removeFromStack } from './service';
import type { ModalOptions } from './types';
import { defer, type Deferred } from './utils';

export class Modal {
  component: ComponentType;
  props: object | Record<string | number | symbol, unknown>;
  private deferred = defer();
  result?: unknown;
  componentInstance?: SvelteComponentTyped;
  deferredOutAnimation?: Deferred<void>;

  options: ModalOptions;

  constructor(component: ComponentType, props?: object, options?: Partial<ModalOptions>) {
    this.component = component;
    this.props = props ?? {};
    this.options = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onAnimationModalOutEnd: (): void => {},
      ...options,
    };
  }

  resolve(value?: unknown): void {
    if (this.deferredOutAnimation) {
      return;
    }

    this.deferredOutAnimation = defer<void>();
    if (this.options.onAnimationModalOutEnd) {
      this.deferredOutAnimation.promise
        .then(() => this.options.onAnimationModalOutEnd?.())
        .catch(() => {
          // noop
        });
    }

    this.result = value;
    this.deferred.resolve(value);
  }

  destroy() {
    this.componentInstance?.destroyModal();
  }

  close() {
    this.componentInstance?.closeModal();
  }

  remove(): void {
    removeFromStack(this);
    this.deferredOutAnimation?.resolve();
  }

  then(
  ): Promise<unknown> {
    onFulfilled: (value: unknown) => unknown,
    onRejected?: (reason: unknown) => unknown
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.deferred.promise.then(onFulfilled, onRejected);
  }

  get isClosing(): boolean {
    return Boolean(this.deferredOutAnimation);
  }
}
