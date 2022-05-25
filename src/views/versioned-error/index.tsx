/**
 * Note: this component is somewhat duplicative of the dot-io version,
 * in views/_proxied-dot-io/versioned error.
 *
 * The main difference in this version is stylistic.
 * Perhaps there is a way to further abstract the versioned error page logic.
 */

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useErrorPageAnalytics } from '@hashicorp/react-error-view'
import { ErrorPageProps } from './types'
import { DevDot404, DevDotFallback, DevDotVersioned404 } from './components'

const versionPattern = /\/(?<version>v\d+[.]\d+[.](\d+|x))/

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
  useErrorPageAnalytics(statusCode)
  const { asPath } = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  /**
   * Due to how we are rewriting routes on the io sites, the URLs rendered in VersionNotFound are incorrect during SSR,
   * and for some reason are NOT getting reconciled on the client even though all of the props and state values internal to Link
   * are correct.
   *
   * I think it's because of some hydration mismatch, so I'm using the isMounted state value as a key here to force the error view
   * to completely re-mount. I'm sorry, I tried everything else I could think of. :')
   */
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const versionMatches = versionPattern.exec(asPath)
  const versionInPath = versionMatches?.groups?.version

  if (versionInPath && statusCode == 404) {
    return (
      <DevDotVersioned404
        version={versionInPath}
        pathWithoutVersion={asPath.replace(versionPattern, '')}
        key={String(isMounted)}
      />
    )
  } else if (statusCode == 404) {
    return <DevDot404 />
  } else {
    return <DevDotFallback />
  }
}

export { VersionedErrorPage }
