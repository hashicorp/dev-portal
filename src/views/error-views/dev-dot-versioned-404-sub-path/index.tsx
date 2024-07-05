/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import useErrorPageAnalytics from '@hashicorp/react-error-view/use-error-page-analytics'
import ButtonLink from 'components/button-link'
import {
	ErrorViewContainer,
	ErrorViewCtas,
	ErrorViewH1,
	ErrorViewParagraph,
} from '../components'

/**
 * Versioned 404 error view content for use in dev-dot.
 * Links back to the "most recent version" (pathWithoutVersion),
 * as well as the documentation root (pathBeforeVersion).
 */
export function DevDotVersioned404SubPath({
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
		<ErrorViewContainer>
			<ErrorViewH1>This page does not exist for version {version}.</ErrorViewH1>
			<ErrorViewParagraph>
				Please visit the latest version, or view all documentation for version{' '}
				{version}.
			</ErrorViewParagraph>
			<ErrorViewCtas>
				<ButtonLink text={`Latest version`} href={pathWithoutVersion} />
				<ButtonLink
					color="secondary"
					text={`All ${version} documentation`}
					href={`${pathBeforeVersion}/${version}`}
				/>
			</ErrorViewCtas>
		</ErrorViewContainer>
	)
}
