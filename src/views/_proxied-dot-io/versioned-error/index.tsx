/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React from 'react'
import Link from 'next/link'
import useErrorPageAnalytics from '@hashicorp/react-error-view/use-error-page-analytics'
import s from '@hashicorp/react-error-view/style.module.css'

/*
 * Versioned 404 error view content for use in dot-io sites.
 * Links back to the "most recent version" (pathWithoutVersion),
 * as well as the documentation root (pathBeforeVersion).
 */
function VersionedError({
	version,
	pathWithoutVersion,
	pathBeforeVersion,
}: {
	version: string
	pathWithoutVersion: string
	pathBeforeVersion: string
}): React.ReactElement {
	useErrorPageAnalytics(404)

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
				<Link href={pathBeforeVersion}>← Go back to Documentation</Link>
			</p>
		</div>
	)
}

export default VersionedError
