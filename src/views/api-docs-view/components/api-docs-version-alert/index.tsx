/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconInfo16 } from '@hashicorp/flight-icons/svg-react/info-16'
import InlineLink from 'components/inline-link'
import PageAlert from 'components/page-alert'
import type { ApiDocsVersionAlertProps } from './types'
import s from './api-docs-version-alert.module.css'

/**
 * Display a version alert for API documentation
 */
function ApiDocsVersionAlert({
	isVersionedUrl,
	currentVersion,
	latestStableVersion,
}: ApiDocsVersionAlertProps) {
	/**
	 * If this isn't a versioned URL, we won't show a version alert.
	 */
	if (!isVersionedUrl) {
		return null
	}

	/**
	 * If this is a versioned URL, but it's the same content as the latest URL,
	 * we also won't show a version alert.
	 */
	if (latestStableVersion.versionId === currentVersion.versionId) {
		return null
	}

	/**
	 * Otherwise, build a message and link, and show the version alert.
	 */
	const latestLinkUrl = '/hcp/api-docs/packer'
	const latestLinkText = 'View latest version'
	let versionMessage: string
	if (currentVersion.releaseStage === 'preview') {
		// May be a preview version
		versionMessage = `You are viewing documentation for the preview version ${currentVersion.versionId}.`
	} else {
		// Otherwise, is some other version, such as non-latest table version
		versionMessage = `You are viewing documentation for version ${currentVersion.versionId}.`
	}

	return (
		<VersionAlert
			message={versionMessage}
			latestLinkUrl={latestLinkUrl}
			latestLinkText={latestLinkText}
		/>
	)
}

/**
 * Display a generic version alert
 */
function VersionAlert({
	message,
	latestLinkUrl,
	latestLinkText,
}: {
	message: string
	latestLinkUrl: string
	latestLinkText: string
}) {
	return (
		<PageAlert
			className={s.root}
			description={
				<>
					{message}{' '}
					<InlineLink
						className={s.versionAlertLink}
						href={latestLinkUrl}
						textSize={200}
						textWeight="medium"
					>
						{latestLinkText}
					</InlineLink>
					.
				</>
			}
			icon={<IconInfo16 />}
			type="highlight"
		/>
	)
}

export { ApiDocsVersionAlert }
