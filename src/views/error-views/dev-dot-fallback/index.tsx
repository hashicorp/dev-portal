import { useErrorPageAnalytics } from '@hashicorp/react-error-view'
import s from './dev-dot-fallback.module.css'

export function DevDotFallback({ statusCode }: { statusCode: $TSFixMe }) {
  useErrorPageAnalytics(statusCode)

  return (
    <div className={s.root}>
      <h1 className={s.heading}>Something went wrong.</h1>
      <p className={s.body}>
        We&apos;re sorry, but the requested page isn&apos;t available right now.
        We&apos;ve logged this as an error, and will look into it. Please check
        back soon.
      </p>
    </div>
  )
}
