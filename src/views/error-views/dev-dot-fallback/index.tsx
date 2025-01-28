/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useErrorPageAnalytics } from '@hashicorp/react-error-view'
import {
	ErrorViewContainer,
	ErrorViewH1,
	ErrorViewParagraph,
} from '../components'

/**
 * Fallback error view content for use in dev-dot.
 * Intended to handle any statusCode that is not 404.
 */
export function DevDotFallback({ statusCode }: { statusCode: number }) {
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
