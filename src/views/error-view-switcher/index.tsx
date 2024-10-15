/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { ErrorPageProps } from './types'
import { DevDot404, DevDotFallback, DevDotVersioned404 } from '../error-views'

const VERSION_COMBO_PATTERN =
	// @eslint-disable-next-line
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
function ErrorView({ statusCode }: ErrorPageProps): ReactElement {
	const { asPath } = useRouter()

	/**
	 * Determine if this is a 404 or versioned 404 view.
	 * For versioned views, determine the  path without version (aka latest)
	 */
	const versionMatches = VERSION_COMBO_PATTERN.exec(asPath)
	const versionInPath = versionMatches?.groups?.version
	const pathWithoutVersion = asPath.replace(VERSION_COMBO_PATTERN, '')
	const pathBeforeVersion = versionInPath
		? asPath.substring(0, asPath.indexOf(versionInPath))
		: asPath
	const is404 = Boolean(statusCode === 404)
	const isVersioned404 = Boolean(versionInPath && is404)

	/**
	 * Determine the error page type and return the appropriate component
	 */
	switch (true) {
		case isVersioned404:
			return (
				<DevDotVersioned404
					pathBeforeVersion={pathBeforeVersion}
					pathWithoutVersion={pathWithoutVersion}
					version={versionInPath}
				/>
			)
		case is404:
			return <DevDot404 />
		default:
			return <DevDotFallback statusCode={statusCode} />
	}
}

export default ErrorView
