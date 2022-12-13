import { IconPlus16 } from '@hashicorp/flight-icons/svg-react/plus-16'
import classNames from 'classnames'
import Button from 'components/button'
import Card from 'components/card'
import DropdownDisclosure, {
	DropdownDisclosureLinkItem,
} from 'components/dropdown-disclosure'
import { Flag, Integration } from 'lib/integrations-api-client/integration'
import { Release } from 'lib/integrations-api-client/release'
import TagList, {
	GetIntegrationTags,
	Size,
} from 'views/product-integrations-landing/components/tag-list'
import s from './style.module.css'

interface HeaderProps {
	integration: Integration
	activeRelease: Release
	versions: {
		value: string
		label: string
		href: string
	}[]
	onInstallClicked: () => void
	className?: string
}

export default function HeaderTwo({
	integration,
	activeRelease,
	versions,
	onInstallClicked,
	className,
}: HeaderProps) {
	const showVersions = !integration.hide_versions && versions.length > 1
	const dropdownLabel = versions.find(
		(v) => v.value === activeRelease.version
	).label
	const otherVersions = versions.filter(
		(e) => e.value !== activeRelease.version
	)
	const shouldShowInstallButton = !integration.flags
		.map((f: Flag) => f.slug)
		.includes('builtin')
	return (
		<Card className={classNames(s.header, className)}>
			<div className={s.upperCard}>
				<div className={s.left}>
					<h1>{integration.name}</h1>
					<span>@{integration.organization.slug}</span>
				</div>
				<div className={s.right}>
					{showVersions ? (
						<DropdownDisclosure
							className={s.versionDropdown}
							color="secondary"
							text={dropdownLabel}
						>
							{otherVersions.map((version) => {
								return (
									<DropdownDisclosureLinkItem
										key={version.value}
										href={version.href}
									>
										v{version.value}
									</DropdownDisclosureLinkItem>
								)
							})}
						</DropdownDisclosure>
					) : null}
				</div>
			</div>

			<div className={s.lowerCard}>
				<TagList
					size={Size.MEDIUM}
					tags={GetIntegrationTags(integration, true)}
				/>
				{!shouldShowInstallButton && (
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
