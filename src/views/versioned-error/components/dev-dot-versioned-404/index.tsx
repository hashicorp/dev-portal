import { useRouter } from 'next/router'
import ButtonLink from 'components/button-link'
import Link from 'next/link'
import useErrorPageAnalytics from '@hashicorp/react-error-view/use-error-page-analytics'
import s from './dev-dot-versioned-404.module.css'

export function DevDotVersioned404({
  version,
  pathWithoutVersion,
}: {
  version: string
  pathWithoutVersion: string
}): React.ReactElement {
  const { asPath } = useRouter()
  useErrorPageAnalytics(404)

  const basePath = asPath.split('/')[1]

  return (
    <div className={s.root}>
      <h1 className={s.heading}>
        This page does not exist for version {version}.
      </h1>
      <p className={s.body}>
        Please select either the{' '}
        <Link href={pathWithoutVersion}>most recent version</Link> or a valid
        version that includes the page you are&nbsp;looking&nbsp;for.
      </p>
      <div className={s.cta}>
        <ButtonLink text="Go back to Documentation" href={`/${basePath}`} />
      </div>
    </div>
  )
}
