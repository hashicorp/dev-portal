import classNames from 'classnames'
import DropdownDisclosure, {
	DropdownDisclosureLinkItem,
} from 'components/dropdown-disclosure'
import { Tier } from 'lib/integrations-api-client/integration'
import { Release } from 'lib/integrations-api-client/release'
import TierBadge from 'views/product-integrations-landing/components/tier-badge'
import s from './style.module.css'

interface HeaderProps {
	className?: string
	name: string
	tier: Tier
	author: string
	activeRelease: Release
	versions: {
		value: string
		label: string
		href: string
	}[]
	description?: string
	hideVersions?: boolean
}

export default function Header({
	className,
	name,
	tier,
	author,
	versions,
	hideVersions,
	description,
	activeRelease,
}: HeaderProps) {
	const showVersions = !hideVersions && versions.length > 1
	const dropdownLabel = versions.find(
		(v) => v.value === activeRelease.version
	).label

	const otherVersions = versions.filter(
		(e) => e.value !== activeRelease.version
	)

	return (
		<div className={classNames(s.header, className)}>
			<div className={s.left}>
				<div className={s.nameTier}>
					<h1>{name}</h1>
					<TierBadge
						className={s.tierBadge}
						tier={tier}
						productSlug="waypoint"
						size="large"
					/>
				</div>
				<h3 className={s.author}>@{author}</h3>
				<p>{description}</p>
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
	)
}
