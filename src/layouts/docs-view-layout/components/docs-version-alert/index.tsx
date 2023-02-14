// HashiCorp imports
import { IconInfo16 } from '@hashicorp/flight-icons/svg-react/info-16'

// Global imports
import { getVersionFromPath } from 'lib/get-version-from-path'
import { removeVersionFromPath } from 'lib/remove-version-from-path'
import useCurrentPath from 'hooks/use-current-path'
import InlineLink from 'components/inline-link'
import PageAlert from 'components/page-alert'

// Local imports
import s from './docs-version-alert.module.css'

/**
 * Renders an alert banner if the current URL indicates a non-latest version,
 * showing a link to the latest version.
 *
 * Note that the logic here is based specifically on docs URL structures.
 */
function DocsVersionAlertBanner() {
	const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
	const currentlyViewedVersion = getVersionFromPath(currentPath)

	// If we're viewing the latest version, we don't need an alert banner
	if (!currentlyViewedVersion) {
		return null
	}

	// Otherwise, render a version alert banner
	return (
		<PageAlert
			className={s.versionAlert}
			description={
				<>
					You are viewing documentation for version {currentlyViewedVersion}.{' '}
					<InlineLink
						className={s.versionAlertLink}
						href={removeVersionFromPath(currentPath)}
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

export { DocsVersionAlertBanner }
