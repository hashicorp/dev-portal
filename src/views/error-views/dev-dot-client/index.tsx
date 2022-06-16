// import { useErrorPageAnalytics } from '@hashicorp/react-error-view'
import {
  ErrorViewContainer,
  ErrorViewH1,
  ErrorViewParagraph,
} from '../components'

/**
 * Fallback error view content for use with dev-dot ErrorBoundary.
 * Intended to handle client-side rendering errors.
 */
export function DevDotClient() {
  /**
   * TODO: specific error for client-side issues?
   */
  //   useErrorPageAnalytics(statusCode)

  return (
    <ErrorViewContainer>
      <ErrorViewH1>Something went wrong.</ErrorViewH1>
      <ErrorViewParagraph>
        We&apos;re sorry, but we&apos;ve run into an unexpected issue.
        We&apos;ve logged this as an error, and will look into it. Please check
        back soon.
      </ErrorViewParagraph>
    </ErrorViewContainer>
  )
}
