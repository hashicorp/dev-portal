export interface ErrorPageProps {
  /**
   * Error code to be recorded via window.analytics.track
   */
  statusCode: number

  /**
   * If the error page is being server on a dot-io domain,
   * then isProxiedDotIo should be set to true.
   */
  isProxiedDotIo: boolean
}
