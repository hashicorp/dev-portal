/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// HashiCorp imports
import { IconInfo16 } from '@hashicorp/flight-icons/svg-react/info-16'

// Global imports
import InlineLink from 'components/inline-link'
import PageAlert from 'components/page-alert'

// Local imports
import s from './version-alert-banner.module.css'

/**
 * Renders an alert banner showing the current version,
 * as well as a link to the latest version.
 */
export default function VersionAlertBanner({
	currentVersion,
	releaseStage,
	latestVersionUrl,
}: {
	currentVersion: string
	releaseStage?: string
	latestVersionUrl: string
}) {
	let versionMessage = 'You are viewing documentation for version'

	if (typeof releaseStage !== 'undefined' && releaseStage !== 'stable') {
		versionMessage = `You are viewing documentation for pre-release version`
	}

	return (
		<PageAlert
			className={s.root}
			description={
				<>
					{versionMessage} {currentVersion}.{' '}
					<InlineLink
						className={s.versionAlertLink}
						href={latestVersionUrl}
						textSize={200}
						textWeight="medium"
					>
						View latest version
					</InlineLink>
					.
				</>
			}
			icon={<IconInfo16 />}
			type="highlight"
		/>
	)
}
