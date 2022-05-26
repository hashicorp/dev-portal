import { useErrorPageAnalytics } from '@hashicorp/react-error-view'
import {
  ErrorViewContainer,
  ErrorViewH1,
  ErrorViewParagraph,
} from '../components'

export function DevDotFallback({ statusCode }: { statusCode: $TSFixMe }) {
  useErrorPageAnalytics(statusCode)

  return (
    <ErrorViewContainer>
      <ErrorViewH1>Something went wrong.</ErrorViewH1>
      <ErrorViewParagraph>
        We&apos;re sorry, but the requested page isn&apos;t available right now.
        We&apos;ve logged this as an error, and will look into it. Please check
        back soon.
      </ErrorViewParagraph>
    </ErrorViewContainer>
  )
}
