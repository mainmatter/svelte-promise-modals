import type { Component } from 'svelte';

import type ModalComponent from './Modal.svelte';
import { removeFromStack } from './service';
import type { CloseModalFnValue, ModalOptions, PropsWithoutCloseModal } from './types';
import { defer, type Deferred } from './utils';

export class Modal<T extends Component> {
  private deferred = defer<CloseModalFnValue<T>>();

  component: T;
  props: PropsWithoutCloseModal<T>;
  options: ModalOptions;

  result?: CloseModalFnValue<T>;
  deferredOutAnimation?: Deferred<void>;
  componentInstance?: ModalComponent;

  constructor(
    component: T,
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
    onFulfilled: (value: CloseModalFnValue<T>) => void,
    onRejected?: (reason?: unknown) => void
  ): Promise<CloseModalFnValue<T>> {
    return this.deferred.promise.then<any, any>(onFulfilled, onRejected);
  }

  get isClosing(): boolean {
    return Boolean(this.deferredOutAnimation);
  }
}
