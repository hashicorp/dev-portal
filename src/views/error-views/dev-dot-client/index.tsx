/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Head from 'next/head'
import { DatadogHeadTag, DatadogScriptTag } from 'lib/datadog'
import { useEffect } from 'react'
import {
	ErrorViewContainer,
	ErrorViewH1,
	ErrorViewParagraph,
} from '../components'

/**
 * Fallback error view content for use with dev-dot ErrorBoundary.
 * Intended to handle client-side rendering errors.
 */
export function DevDotClient({ error }: { error: Error }) {
	useEffect(() => {
		/**
		 * Note: window.DD_RUM is expected to be initialized by lib/datadog,
		 * via layouts/core-dev-dot.
		 */
		if (typeof window.DD_RUM !== 'undefined') {
			window.DD_RUM.onReady(function () {
				window.DD_RUM.addError(error)
			})
		}
	}, [error])

	return (
		<>
			<Head>
				<DatadogHeadTag />
			</Head>
			<ErrorViewContainer>
				<ErrorViewH1>Something went wrong.</ErrorViewH1>
				<ErrorViewParagraph>
					We&apos;re sorry, but we&apos;ve run into an unexpected issue.
					We&apos;ve logged this as an error, and will look into it. Please
					reload the page, or check back later.
				</ErrorViewParagraph>
			</ErrorViewContainer>
			<DatadogScriptTag />
		</>
	)
}
