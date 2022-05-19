import { default as reactHotToast, Toast } from 'react-hot-toast'
import ToastDisplay from './components/toast-display'
import { ToastDisplayProps, ToastColor } from './components/toast-display/types'
import { Toaster } from './_temp-react-components/toast'

function toast({ title, description }: Omit<ToastDisplayProps, 'onDismiss'>) {
  return reactHotToast((t: Toast) => {
    return (
      <ToastDisplay
        title={title}
        description={description}
        onDismiss={() => reactHotToast.remove(t.id)}
      />
    )
  })
}

export { reactHotToast, Toaster, ToastDisplay, toast, ToastColor }

// Default export is used in Swingset
export default ToastDisplay
