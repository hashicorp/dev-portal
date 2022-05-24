import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { default as reactHotToast, Toast } from 'react-hot-toast'
import Toaster from './components/toaster'
import ToastDisplay from './components/toast-display'
import { ToastDisplayProps, ToastColor } from './components/toast-display/types'
import { ToastOptions } from './types'

const AUTO_DISMISS_DEFAULT = 4000

/**
 * Wraps our ToastDisplay component in react-hot-toast.
 */
function toast({
  renderActions,
  color,
  description,
  icon,
  title,
  onDismissCallback = () => null,
  autoDismiss = AUTO_DISMISS_DEFAULT,
  dismissOnRouteChange = true,
}: Omit<ToastDisplayProps, 'dismissSelf'> & ToastOptions) {
  // Determine the auto-dismiss duration
  let duration: number
  if (autoDismiss == false) {
    duration = Infinity
  } else if (typeof autoDismiss == 'number' && autoDismiss > 0) {
    duration = autoDismiss
  } else {
    duration = AUTO_DISMISS_DEFAULT
  }

  // Return a react-hot-toast
  return reactHotToast(
    (t: Toast) => {
      const router = useRouter()

      // Allows the toast to dismiss itself
      const dismissSelf = useCallback(() => {
        onDismissCallback()
        reactHotToast.remove(t.id)
      }, [t.id])

      // If specified, when the route changes, we should dismiss the toast
      useEffect(() => {
        if (dismissOnRouteChange) {
          router.events.on('routeChangeComplete', dismissSelf)
        }
        // Clean up
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
        />
      )
    },
    { duration }
  )
}

export { reactHotToast, Toaster, ToastDisplay, toast, ToastColor }
/**
 * Note: default export is used in Swingset.
 * ToastDisplay should generally NOT be used directly.
 */
export default ToastDisplay
