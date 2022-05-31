import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { default as reactHotToast, Toast } from 'react-hot-toast'
import Toaster from './components/toaster'
import ToastDisplay from './components/toast-display'
import { ToastDisplayProps, ToastColor } from './components/toast-display/types'
import { ToastOptions } from './types'

const AUTO_DISMISS_DEFAULT_MS = 4000

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
  autoDismiss = AUTO_DISMISS_DEFAULT_MS,
  dismissOnRouteChange = true,
}: Omit<ToastDisplayProps, 'dismissSelf'> & ToastOptions) {
  // Determine the auto-dismiss duration
  let duration: number
  if (autoDismiss == false) {
    duration = Infinity
  } else if (typeof autoDismiss == 'number' && autoDismiss > 0) {
    duration = autoDismiss
  } else {
    duration = AUTO_DISMISS_DEFAULT_MS
  }

  // Return a react-hot-toast
  return reactHotToast(
    (t: Toast) => {
      const [initialRoute, setInitialRoute] = useState(null)
      const router = useRouter()

      // Allows the toast to dismiss itself
      const dismissSelf = useCallback(() => {
        onDismissCallback()
        reactHotToast.remove(t.id)
      }, [t.id])

      /**
       * If specified, when the route changes, we should dismiss the toast.
       * Note: there is a long-standing bug that prevents us from using
       * the more expected routeChangComplete event from NextJS:
       * https://github.com/vercel/next.js/issues/11639
       */
      useEffect(() => {
        if (initialRoute == null) {
          setInitialRoute(router.asPath)
        } else {
          const isRouteChanged = router.asPath !== initialRoute
          if (isRouteChanged && dismissOnRouteChange) {
            dismissSelf()
          }
        }
      }, [router.asPath, initialRoute, setInitialRoute, dismissSelf])

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
