import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useErrorPageAnalytics from '@hashicorp/react-error-view/use-error-page-analytics'
import ErrorPage, { ErrorPageProps } from '@hashicorp/react-error-view'
import s from '@hashicorp/react-error-view/style.module.css'

const versionPattern = /\/(?<version>v\d+[.]\d+[.](\d+|x))/

function VersionNotFound({ version }: { version: string }): React.ReactElement {
  const { asPath } = useRouter()
  useErrorPageAnalytics(404)

  console.log({ asPath })

  const pathWithoutVersion = asPath.replace(versionPattern, '')
  const basePath = asPath.split('/')[1]

  return (
    <div className={s.root}>
      <h1 className={s.heading}>
        This page does not exist for version {version}.
      </h1>
      <p>
        Please select either the{' '}
        <Link href={pathWithoutVersion}>most recent version</Link> or a valid
        version that includes the page you are looking for.
      </p>
      <p>
        <Link href={`/${basePath}`}>← Go back to Documentation</Link>
      </p>
    </div>
  )
}

/**
 * A Standalone error page component intended to be used on sites with versioned docs support.
 * Exports a full, custom implementation of an pages/_error.tsx component.
 *
 * Example:
 *
 * ```tsx
 * import { VersionedErrorPage } from 'views/_proxied-dot-io/versioned-error'
 *
 * export default VersionedErrorPage
 * ```
 */
function VersionedErrorPage({
  statusCode,
}: ErrorPageProps): React.ReactElement {
  const { asPath } = useRouter()

  const versionMatches = versionPattern.exec(asPath)

  const versionInPath = versionMatches?.groups?.version

  return versionInPath && statusCode === 404 ? (
    <VersionNotFound version={versionInPath} key={asPath} />
  ) : (
    <ErrorPage statusCode={statusCode} key={asPath} />
  )
}

export { VersionedErrorPage }
