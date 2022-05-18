import { default as reactHotToast } from 'react-hot-toast'
import type {
  NotificationProps,
  NotificationWithLanguageProps,
  NotificationWithProductProps,
  NotificationWithResourceProps,
  NotificationWithThumbnailProps,
} from '../../notification/types'
import Notification, {
  NotificationWithLanguage,
  NotificationWithProduct,
  NotificationWithResource,
  NotificationWithThumbnail,
} from '../../notification'

type ToastProps = Omit<NotificationProps, 'onDismiss'>

const toast = ({ appearance, description, cta }: ToastProps) => {
  return reactHotToast((t) => {
    return (
      <Notification
        appearance={appearance}
        description={description}
        cta={cta}
        onDismiss={() => reactHotToast.remove(t.id)}
      />
    )
  })
}

/**
 * Toast with language
 * @description renders a toast notification with an associated countries flag
 */

type ToastWithLanguageProps = Omit<NotificationWithLanguageProps, 'onDismiss'>

const toastWithLanguage = ({
  appearance,
  language,
  description,
  cta,
}: ToastWithLanguageProps) => {
  return reactHotToast((t) => {
    return (
      <NotificationWithLanguage
        appearance={appearance}
        language={language}
        description={description}
        cta={cta}
        onDismiss={() => reactHotToast.remove(t.id)}
      />
    )
  })
}

/**
 * Toast with product
 * @description renders a toast notification with a product icon and name
 */

type ToastWithProductProps = Omit<NotificationWithProductProps, 'onDismiss'>

const toastWithProduct = ({
  appearance,
  product,
  description,
  cta,
}: ToastWithProductProps) => {
  return reactHotToast((t) => {
    return (
      <NotificationWithProduct
        appearance={appearance}
        product={product}
        description={description}
        cta={cta}
        onDismiss={() => reactHotToast.remove(t.id)}
      />
    )
  })
}

/**
 * Toast with resource
 * @description renders a toast notification with a predefined resource type
 */

type ToastWithResourceProps = Omit<NotificationWithResourceProps, 'onDismiss'>

const toastWithResource = ({
  appearance,
  type,
  description,
  cta,
}: ToastWithResourceProps) => {
  return reactHotToast((t) => {
    return (
      <NotificationWithResource
        appearance={appearance}
        type={type}
        description={description}
        cta={cta}
        onDismiss={() => reactHotToast.remove(t.id)}
      />
    )
  })
}

/**
 * Toast with thumbnail
 * @description renders a toast notification with a 4/3 ratio thumbnail
 */

type ToastWithThumbnailProps = Omit<NotificationWithThumbnailProps, 'onDismiss'>

const toastWithThumbnail = ({
  appearance,
  thumbnail,
  description,
  cta,
}: ToastWithThumbnailProps) => {
  return reactHotToast((t) => {
    return (
      <NotificationWithThumbnail
        appearance={appearance}
        thumbnail={thumbnail}
        description={description}
        cta={cta}
        onDismiss={() => reactHotToast.remove(t.id)}
      />
    )
  })
}

export {
  toast,
  toastWithLanguage,
  toastWithProduct,
  toastWithResource,
  toastWithThumbnail,
}
