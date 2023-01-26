import { IconPlus16 } from '@hashicorp/flight-icons/svg-react/plus-16'
import classNames from 'classnames'
import Button from 'components/button'
import Card from 'components/card'
import DropdownDisclosure, {
	DropdownDisclosureLinkItem,
} from 'components/dropdown-disclosure'
import { formatIntegrationOrg } from 'lib/integrations'
import { Flag, Integration } from 'lib/integrations-api-client/integration'
import { Release } from 'lib/integrations-api-client/release'
import TagList, {
	GetIntegrationTags,
} from 'views/product-integrations-landing/components/tag-list'
import s from './style.module.css'

interface HeaderProps {
	className?: string
	integration: Integration
	activeRelease: Release
	onInstallClicked: () => void
	getVersionChangedURL: (version: string) => string
}

function versionString(version: string, allVersions: string[]): string {
	if (version === allVersions[0]) {
		return `v${version} (latest)`
	} else {
		return `v${version}`
	}
}

export default function Header({
	className,
	integration,
	activeRelease,
	onInstallClicked,
	getVersionChangedURL,
}: HeaderProps) {
	// Determine if we should show the version dropdown at all
	const showVersions =
		!integration.hide_versions && integration.versions.length > 1

	// All of the other versions than the one we're currently displaying
	const otherVersions = integration.versions.filter(
		(e: string) => e !== activeRelease.version
	)

	// If this integration can be installed
	const shouldShowInstallButton = !integration.flags
		.map((f: Flag) => f.slug)
		.includes('builtin')

	return (
		<Card className={classNames(s.header, className)}>
			<div className={s.upperCard}>
				<div className={s.left}>
					<h1>{integration.name}</h1>
					<span>{formatIntegrationOrg(integration.organization.slug)}</span>
				</div>
				<div className={s.right}>
					{showVersions ? (
						<DropdownDisclosure
							className={s.versionDropdown}
							color="secondary"
							text={versionString(activeRelease.version, integration.versions)}
						>
							{otherVersions.map((version: string) => {
								return (
									<DropdownDisclosureLinkItem
										key={version}
										href={getVersionChangedURL(version)}
									>
										{versionString(version, integration.versions)}
									</DropdownDisclosureLinkItem>
								)
							})}
						</DropdownDisclosure>
					) : null}
				</div>
			</div>

			<div className={s.lowerCard}>
				<TagList size="medium" tags={GetIntegrationTags(integration, true)} />
				{shouldShowInstallButton && (
					<Button
						text="Install"
						icon={<IconPlus16 />}
						onClick={(e) => {
							e.preventDefault()
							onInstallClicked()
						}}
					/>
				)}
			</div>
		</Card>
	)
}
