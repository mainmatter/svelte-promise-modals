import type { ComponentProps, SvelteComponent } from 'svelte';

import { removeFromStack } from './service';
import type { ModalOptions } from './types';
import { defer, type Deferred } from './utils';

export class Modal<T extends SvelteComponent, V extends ComponentProps<T>> {
  private deferred = defer<ReturnType<V['closeModal']>>();
  component: SvelteComponent;
  props: Omit<V, 'closeModal'>;
  result?: ReturnType<V['closeModal']>;
  deferredOutAnimation?: Deferred<void>;
  componentInstance?: SvelteComponent;

  options: ModalOptions;

  constructor(component: T, props?: Omit<V, 'closeModal'>, options?: Partial<ModalOptions>) {
    this.component = component;
    this.props = props ?? ({} as Omit<V, 'closeModal'>);
    this.options = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onAnimationModalOutEnd: (): void => {},
      ...options,
    };
  }

  resolve(value: ReturnType<V['closeModal']>): void {
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
    onFulfilled: (value: ReturnType<V['closeModal']>) => unknown,
    onRejected?: (reason: unknown) => unknown
  ): Promise<ReturnType<V['closeModal']>> {
    // TODO: fix type mismatch
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.deferred.promise.then(onFulfilled, onRejected);
  }

  get isClosing(): boolean {
    return Boolean(this.deferredOutAnimation);
  }
}
