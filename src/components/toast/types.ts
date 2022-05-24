export interface ToastOptions {
  /**
   * Set the number of milliseconds after which to auto-dismiss.
   * Defaults to 4000. Set to "false" for show-till-dismissed toast.
   */
  autoDismiss?: number | boolean
  /**
   * Flag that there is interactive content in the toast.
   * If the toast contains interactive content,
   * then we treat it with `role="dialog"`.
   * Note this defaults to `true` if `actions` are provided, `false` otherwise.
   */
  isInteractive?: boolean
  /**
   * Option callback to fire after the toast is dismissed button is clicked.
   * Intended to allow re-focusing of elements that trigger interactive toasts.
   */
  onDismissCallback?: () => void
  /**
   * Optionally auto-dismiss the toast during client-side navigation.
   * Defaults to true. Set to false to persist toast across routes.
   * For non-client-side navigation, toast is always dismissed.
   */
  dismissOnRouteChange?: boolean
}
