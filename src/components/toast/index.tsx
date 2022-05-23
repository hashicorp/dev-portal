import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { default as reactHotToast, Toast } from 'react-hot-toast'
import Toaster from './components/toaster'
import ToastDisplay from './components/toast-display'
import { ToastDisplayProps, ToastColor } from './components/toast-display/types'

const AUTO_DISMISS_DEFAULT = 4000

interface toastOptions {
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
}

/**
 * Wraps our ToastDisplay component in react-hot-toast.
 */
function toast({
  renderActions,
  children,
  color,
  description,
  icon,
  title,
  onDismissCallback = () => null,
  autoDismiss = AUTO_DISMISS_DEFAULT,
}: Omit<ToastDisplayProps, 'dismissSelf'> & toastOptions) {
  //
  return reactHotToast(
    (t: Toast) => {
      const router = useRouter()

      // Allows the toast to dismiss itself
      const dismissSelf = useCallback(() => {
        onDismissCallback()
        reactHotToast.remove(t.id)
      }, [t.id])

      // When the route changes, we should dismiss the toast
      useEffect(() => {
        router.events.on('routeChangeComplete', dismissSelf)
        // Clean up the effect
        return () => {
          router.events.off('routeChangeComplete', dismissSelf)
        }
      }, [router.events, dismissSelf])

      return (
        <ToastDisplay
          renderActions={renderActions}
          color={color}
          description={description}
          icon={icon}
          dismissSelf={dismissSelf}
          title={title}
        >
          {children}
        </ToastDisplay>
      )
    },
    {
      duration:
        autoDismiss == false
          ? Infinity
          : autoDismiss == true
          ? AUTO_DISMISS_DEFAULT
          : autoDismiss,
    }
  )
}

export { reactHotToast, Toaster, ToastDisplay, toast, ToastColor }
/**
 * Note: default export is used in Swingset.
 * ToastDisplay should generally NOT be used directly.
 */
export default ToastDisplay
