import {
  Fragment,
  MutableRefObject,
  ReactNode,
  useEffect,
  useState,
} from 'react'
import { DialogOverlay, DialogContent } from './_temp-forked-reach-dialog'
import { default as reactHotToast, Toast } from 'react-hot-toast'
import Toaster from './components/toaster'
import ToastDisplay from './components/toast-display'
import { ToastDisplayProps, ToastColor } from './components/toast-display/types'

interface toastOptions {
  /**
   * Defaults to true. Set to false to prevent the toast from auto-dismissing.
   */
  autoDismiss?: boolean
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
  actions,
  children,
  color,
  description,
  icon,
  title,
  autoDismiss = true,
  onDismissCallback = () => null,
  isInteractive = Boolean(actions),
}: Omit<ToastDisplayProps, 'onDismiss'> & toastOptions) {
  //
  return reactHotToast(
    (t: Toast) => {
      function onDismiss() {
        onDismissCallback()
        reactHotToast.remove(t.id)
      }

      // TODO: reconsider what the dialog aria-label should be
      const dialogAriaLabel = title || description || 'Notification'

      // For interactive content, we wrap the toast display component
      // in a reach-ui dialog. This captures focus.
      const Wrapper = isInteractive
        ? ({ children }: { children: ReactNode }) => (
            <DialogOverlay onDismiss={onDismiss} dangerouslyBypassScrollLock>
              <DialogContent aria-label={dialogAriaLabel}>
                {children}
              </DialogContent>
            </DialogOverlay>
          )
        : Fragment
      return (
        <Wrapper>
          <ToastDisplay
            actions={actions}
            color={color}
            description={description}
            icon={icon}
            onDismiss={onDismiss}
            title={title}
          >
            {children}
          </ToastDisplay>
        </Wrapper>
      )
    },
    {
      duration: autoDismiss ? 4000 : Infinity,
      ariaProps: {
        'aria-live': isInteractive
          ? 'off' // Interactive content has a dialog role, so no announcing
          : color == 'critical'
          ? 'assertive'
          : 'polite',
        role: isInteractive
          ? // Note: we want role="dialog" here for interactive content,
            // but react-hot-toast's types don't allow it. So we force it.
            ('dialog' as unknown as Toast['ariaProps']['role'])
          : 'status',
      },
    }
  )
}

export { reactHotToast, Toaster, ToastDisplay, toast, ToastColor }
/**
 * Note: default export is used in Swingset.
 * ToastDisplay should generally NOT be used directly.
 */
export default ToastDisplay
