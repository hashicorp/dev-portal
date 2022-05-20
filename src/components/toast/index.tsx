import { default as reactHotToast, Toast } from 'react-hot-toast'
import Toaster from './components/toaster'
import ToastDisplay from './components/toast-display'
import { ToastDisplayProps, ToastColor } from './components/toast-display/types'

interface toastOptions {
  /**
   * Defaults to true. Set to false to prevent the toast from auto-dismissing.
   */
  autoDismiss?: boolean
}

/**
 * Wraps our ToastDisplay component in react-hot-toast.
 */
function toast({
  actions,
  children,
  color,
  description,
  icon,
  title,
  autoDismiss = true,
}: Omit<ToastDisplayProps, 'onDismiss'> & toastOptions) {
  const toastFn = autoDismiss ? reactHotToast : reactHotToast.loading
  return toastFn((t: Toast) => {
    return (
      <ToastDisplay
        actions={actions}
        color={color}
        description={description}
        icon={icon}
        onDismiss={() => reactHotToast.remove(t.id)}
        title={title}
      >
        {children}
      </ToastDisplay>
    )
  })
}

export { reactHotToast, Toaster, ToastDisplay, toast, ToastColor }
/**
 * Note: default export is used in Swingset.
 * ToastDisplay should generally NOT be used directly.
 */
export default ToastDisplay
