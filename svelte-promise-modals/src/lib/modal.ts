import type { Component } from 'svelte';

import type ModalComponent from './Modal.svelte';
import { removeFromStack } from './service.svelte';
import type { CloseModalFnValue, ModalOptions, PropsWithoutCloseModal } from './types';
import { defer, type Deferred } from './utils';

export class Modal<T extends Component> {
  private deferred = defer<CloseModalFnValue<T>>();

  component: Component<T>;
  props: PropsWithoutCloseModal<T>;
  options: ModalOptions;

  result?: CloseModalFnValue<T>;
  deferredOutAnimation?: Deferred<void>;

  constructor(
    component: Component<T>,
    props?: PropsWithoutCloseModal<T>,
    options?: Partial<ModalOptions>
  ) {
    this.component = component;
    this.props = props ?? ({} as PropsWithoutCloseModal<T>);
    this.options = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onAnimationModalOutEnd: (): void => {},
      ...options,
    };
  }

  resolve = (value: CloseModalFnValue<T>): void => {
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
  };

  remove(): void {
    removeFromStack(this);
    this.deferredOutAnimation?.resolve();
  }

  then(
    onFulfilled: (value: CloseModalFnValue<T>) => void,
    onRejected?: (reason?: unknown) => void
  ): Promise<CloseModalFnValue<T>> {
    return this.deferred.promise.then<any, any>(onFulfilled, onRejected);
  }

  destroy(): void {
    // Force immediate cleanup without animation
    this.deferredOutAnimation = defer<void>();
    this.result = null as any;
    this.deferred.resolve(null as any);
    removeFromStack(this);
    this.deferredOutAnimation.resolve();
  }

  close(value?: CloseModalFnValue<T>): void {
    this.resolve(value ?? (null as any));
  }

  get isClosing(): boolean {
    return Boolean(this.deferredOutAnimation);
  }
}
