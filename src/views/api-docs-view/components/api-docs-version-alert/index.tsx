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
	 * Otherwise, build a message and link, and show the version alert.
	 */
	const latestLinkUrl = '/hcp/api-docs/packer'
	let latestLinkText = 'View latest version'
	let versionMessage: string
	if (latestStableVersion.versionId === currentVersion.versionId) {
		// May be the latest stable version at an "explicit version" URL
		versionMessage =
			'You are viewing the latest documentation at a versioned URL.'
		latestLinkText = `View at the latest URL`
	} else if (currentVersion.releaseStage === 'preview') {
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
