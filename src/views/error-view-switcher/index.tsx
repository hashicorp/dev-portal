/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ErrorPageProps } from './types'
import { DevDot404, DevDotFallback, DevDotVersioned404 } from '../error-views'

const VERSION_COMBO_PATTERN =
	/\/(?<version>(v\d+([.]|_)\d+([.]|_)(\d+|x))|(v[0-9]{6}-\d+))/
/**
 * A display component that switches between:
 * - Dev-dot error views otherwise
 *
 * This switching isn't ideal; but feels somewhat logical since we are
 * limited to having a single pages/_error.jsx page file in the project.
 *
 * This component also handles auto-selecting versioned 404 views,
 * by matching version pattern in the page URL.
 */
function ErrorView({ statusCode }: ErrorPageProps): React.ReactElement {
	/**
	 * Note: DotIoFallbackError calls useErrorPageAnalytics internally.
	 * If it didn't, we could call useErrorPageAnalytics once here, or in
	 * pages/_error.tsx, rather than in every error view component.
	 * useErrorPageAnalytics(statusCode).
	 *
	 * One solution might be localize `@hashicorp/react-error-view`
	 * in the dev-portal project. However, we may not be ready to do that,
	 * as the package may be used elsewhere?
	 */
	const { asPath } = useRouter()
	const [isMounted, setIsMounted] = useState(false)

	/**
	 * Note from Bryce on this useEffect:
	 *
	 * Due to how we are rewriting routes on the io sites, the URLs rendered in
	 * this component are incorrect during SSR, and for some reason are NOT
	 * getting reconciled on the client even though all of the props and state
	 * values internal to Link are correct.
	 *
	 * I think it's because of some hydration mismatch, so I'm using the
	 * isMounted state value as a key here to force the error view to completely
	 * re-mount. I'm sorry, I tried everything else I could think of. :')
	 */
	useEffect(() => {
		setIsMounted(true)
	}, [])

	/**
	 * Determine if this is a 404 or versioned 404 view.
	 * For versioned views, determine the  path without version (aka latest)
	 */
	const versionMatches = VERSION_COMBO_PATTERN.exec(asPath)
	const versionInPath = versionMatches?.groups?.version
	const pathWithoutVersion = asPath.replace(VERSION_COMBO_PATTERN, '')
	const pathBeforeVersion = asPath.substring(0, asPath.indexOf(versionInPath))
	const is404 = statusCode == 404
	const isVersioned404 = versionInPath && is404

	console.log(
		'### error info',
		statusCode,
		versionMatches,
		versionInPath,
		pathWithoutVersion,
		pathBeforeVersion
	)

	/**
	 * Determine the error page type
	 */
	let type:
		| 'dev-dot-versioned-404'
		| 'dev-dot-standard-404'
		| 'dev-dot-fallback'

	if (isVersioned404) {
		type = 'dev-dot-versioned-404'
	} else if (is404) {
		type = 'dev-dot-standard-404'
	} else {
		type = 'dev-dot-fallback'
	}

	switch (type) {
		/* Dev-dot */
		case 'dev-dot-versioned-404':
			return (
				<DevDotVersioned404
					key={String(isMounted)}
					pathBeforeVersion={pathBeforeVersion}
					pathWithoutVersion={pathWithoutVersion}
					version={versionInPath}
				/>
			)
		case 'dev-dot-standard-404':
			return <DevDot404 />
		case 'dev-dot-fallback':
			return <DevDotFallback statusCode={statusCode} />
	}
}

export default ErrorView
