import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useErrorPageAnalytics from '@hashicorp/react-error-view/use-error-page-analytics'
import s from '@hashicorp/react-error-view/style.module.css'

function VersionedError({
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

export default VersionedError
