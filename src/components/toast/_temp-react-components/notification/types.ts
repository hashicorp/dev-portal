import type { Products } from '@hashicorp/platform-product-meta'

export type NotificationLanguages = 'en' | 'de' | 'fr' | 'jp' | 'kr'
export type NotificationProducts = Exclude<Products, 'hashicorp'>
export type NotificationTypes = 'podcast' | 'webinar' | 'whitepaper'

export interface NotificationProps {
  /**
   * Render on light or dark background.
   */
  appearance?: 'light' | 'dark'
  /**
   * The text that appears within the notification.
   */
  description: string
  /**
   * A function called when the close button is clicked.
   */
  onDismiss: () => void
  /**
   * The call to action for the notification.
   */
  cta: {
    title: string
    url: string
  }
}

export interface NotificationWithLanguageProps extends NotificationProps {
  /**
   * Renders flag associated to language defined.
   */
  language: NotificationLanguages
}

export interface NotificationWithProductProps extends NotificationProps {
  /**
   * Renders product logo and name.
   */
  product: NotificationProducts
}

export interface NotificationWithResourceProps extends NotificationProps {
  /**
   * Renders resource type name and icon.
   */
  type: NotificationTypes
}

export interface NotificationWithThumbnailProps extends NotificationProps {
  /**
   * Renders a 4/3 ratio image above the content.
   */
  thumbnail: {
    src: string
    alt: string
  }
}
