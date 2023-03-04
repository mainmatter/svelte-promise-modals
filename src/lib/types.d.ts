import type { Options as FocusTrapOptions } from 'focus-trap';

export type ModalOptions = {
  onAnimationModalOutEnd(): void;
  focusTrapOptions?: FocusTrapOptions;
};

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
