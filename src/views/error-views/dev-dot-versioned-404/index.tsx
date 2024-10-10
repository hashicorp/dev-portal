/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import useErrorPageAnalytics from '@hashicorp/react-error-view/use-error-page-analytics'
import ButtonLink from 'components/button-link'
import InlineLink from 'components/inline-link'
import {
	ErrorViewContainer,
	ErrorViewH1,
	ErrorViewParagraph,
} from '../components'
import s from './dev-dot-versioned-404.module.css'

/**
 * Versioned 404 error view content for use in dev-dot.
 * Links back to the "most recent version" (pathWithoutVersion),
 * as well as the documentation root (pathBeforeVersion).
 */
export function DevDotVersioned404({
	version,
	pathWithoutVersion,
	pathBeforeVersion,
}: {
	version: string
	pathWithoutVersion: string
	pathBeforeVersion: string
}): React.ReactElement {
	// useErrorPageAnalytics(404)

	return (
		<ErrorViewContainer>
			<ErrorViewH1>This page does not exist for version {version}.</ErrorViewH1>
			<ErrorViewParagraph>
				Please select either the{' '}
				<InlineLink href={pathWithoutVersion}>most recent version</InlineLink>{' '}
				or a valid version that includes the page you are&nbsp;looking&nbsp;for.
			</ErrorViewParagraph>
			<div className={s.cta}>
				<ButtonLink text="Go back to Documentation" href={pathBeforeVersion} />
			</div>
		</ErrorViewContainer>
	)
}
