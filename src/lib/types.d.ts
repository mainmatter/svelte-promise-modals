import type { Options as FocusTrapOptions } from 'focus-trap';
import type { ComponentProps } from 'svelte';

export type ModalOptions = {
  onAnimationModalOutEnd?(): void;
  focusTrapOptions?: FocusTrapOptions;
};

export type FocusTrapOptions = FocusTrapOptions;

export type CloseModalFn<T = void> = (value: T) => void;

// prettier-ignore
export type PropsWithoutCloseModal<T extends SvelteComponent> = Omit<ComponentProps<T>, 'closeModal'>;
export type CloseModalValueParamType<T> = T extends CloseModalFn<infer Value> ? Value : void;
export type CloseModalFnValue<
  T,
  V = CloseModalValueParamType<ComponentProps<T>['closeModal']>,
> = V extends void ? undefined : V;

declare module 'focus-trap' {
  // FocusTrap will happily accept `null` or `false` for `onDeactivate` & `onPostDeactivate`,
  // despite what its type declaration is saying.
  //
  // https://github.com/focus-trap/focus-trap#trapdeactivate
  interface DeactivateOptions extends Pick<Options, 'onPostDeactivate' | 'checkCanReturnFocus'> {
    onDeactivate?: Options['onDeactivate'] | null | false;
    onPostDeactivate?: Options['onDeactivate'] | null | false;
    returnFocus?: boolean;
  }
}
