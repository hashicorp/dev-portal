// HashiCorp imports
import { IconInfo16 } from '@hashicorp/flight-icons/svg-react/info-16'

// Global imports
import { getVersionFromPath } from 'lib/get-version-from-path'
import { removeVersionFromPath } from 'lib/remove-version-from-path'
import useCurrentPath from 'hooks/use-current-path'
import InlineLink from 'components/inline-link'
import PageAlert from 'components/page-alert'

// Local imports
import s from './version-alert-banner.module.css'

/**
 * Renders an alert banner if the current URL indicates a non-latest version,
 * showing a link to the latest version.
 *
 * Note that the logic here is based specifically on docs URL structures.
 */
export default function VersionAlertBanner({
	currentVersion,
	latestVersionUrl,
}: {
	currentVersion: string
	latestVersionUrl: string
}) {
	return (
		<PageAlert
			className={s.root}
			description={
				<>
					You are viewing documentation for version {currentVersion}.{' '}
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
