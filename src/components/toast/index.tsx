import { default as reactHotToast, Toast } from 'react-hot-toast'
import Toaster from './components/toaster'
import ToastDisplay from './components/toast-display'
import { ToastDisplayProps, ToastColor } from './components/toast-display/types'

function toast({
  title,
  description,
  color,
  icon,
  actions,
  children,
}: Omit<ToastDisplayProps, 'onDismiss'>) {
  return reactHotToast((t: Toast) => {
    return (
      <ToastDisplay
        title={title}
        color={color}
        actions={actions}
        icon={icon}
        description={description}
        onDismiss={() => reactHotToast.remove(t.id)}
      >
        {children}
      </ToastDisplay>
    )
  })
}

export { reactHotToast, Toaster, ToastDisplay, toast, ToastColor }

// Default export is used in Swingset
export default ToastDisplay
