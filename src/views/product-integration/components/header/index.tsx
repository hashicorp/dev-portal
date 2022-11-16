import classNames from 'classnames'
import DropdownDisclosure, {
	DropdownDisclosureButtonItem,
} from 'components/dropdown-disclosure'
import { Tier } from 'lib/integrations-api-client'
import semverSort from 'semver-sort'
import TierBadge from 'views/product-integrations-landing/components/tier-badge'
import s from './style.module.css'

interface HeaderProps {
	className?: string
	name: string
	tier: Tier
	author: string
	versions: string[]
	description?: string
}

export default function Header({
	className,
	name,
	tier,
	author,
	versions,
	description,
}: HeaderProps) {
	// TODO: Also want to filter out prereleases & 0.0.0 from this list
	const sortedVersions = semverSort.desc(versions)
	const latestVersion: string = sortedVersions[0]
	const otherVersions: Array<string> = sortedVersions.slice(1)
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
				{versions.length > 1 && (
					<DropdownDisclosure
						className={s.versionDropdown}
						color="secondary"
						text={`v${latestVersion} (latest)`}
					>
						{otherVersions.map((version: string) => {
							return (
								<DropdownDisclosureButtonItem
									key={version}
									onClick={() => console.log(`Clicked ${version}`)}
								>
									v{version}
								</DropdownDisclosureButtonItem>
							)
						})}
					</DropdownDisclosure>
				)}
			</div>
		</div>
	)
}
