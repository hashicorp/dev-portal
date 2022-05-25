import { ProductData } from 'types/products'

export interface ErrorPageProps {
  /**
   * Error code to be recorded via window.analytics.track
   */
  statusCode: number

  /**
   * If the error page is being server on a dot-io domain,
   * then the corresponding product slug should be passed here.
   */
  isProxiedDotIo?: boolean

  /**
   * Optional product
   * TODO: does this need to be passed or no?
   */
  product?: ProductData
}
