import classNames from 'classnames'
import DropdownDisclosure, {
	DropdownDisclosureButtonItem,
} from 'components/dropdown-disclosure'
import { Tier } from 'lib/integrations-api-client/integration'
import TierBadge from 'views/product-integrations-landing/components/tier-badge'
import s from './style.module.css'

interface HeaderProps {
	className?: string
	name: string
	tier: Tier
	author: string
	versions: string[]
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
}: HeaderProps) {
	// note - the backend will not return pre-releases,
	// and will sort by semver DESC.
	const latestVersion: string = versions[0]
	const otherVersions: Array<string> = versions.slice(1)
	const showVersions = !hideVersions && versions.length > 1
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
				) : null}
			</div>
		</div>
	)
}
