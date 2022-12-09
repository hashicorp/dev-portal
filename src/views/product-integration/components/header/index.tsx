import classNames from 'classnames'
import DropdownDisclosure, {
	DropdownDisclosureLinkItem,
} from 'components/dropdown-disclosure'
import { Tier } from 'lib/integrations-api-client/integration'
import { Release } from 'lib/integrations-api-client/release'
import { useRouter } from 'next/router'
import TierBadge from 'views/product-integrations-landing/components/tier-badge'
import s from './style.module.css'

interface HeaderProps {
	className?: string
	name: string
	tier: Tier
	author: string
	activeRelease: Release
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
	activeRelease,
}: HeaderProps) {
	// /waypoint/integrations/docker[/0.10.2]
	const { query } = useRouter()

	// Grab Next.js path params — This tightly couples Header to
	// pages with [productSlug] & [...integrationSlug] params
	const productSlug = query.productSlug as string
	const [integrationSlug] = query.integrationSlug as string[]

	// note - the backend will not return pre-releases,
	// and will sort by semver DESC.
	const latestVersion: string = versions[0]
	const otherVersions = versions.filter((v) => v !== activeRelease.version)
	const showVersions = !hideVersions && versions.length > 1

	const dropdownLabel =
		activeRelease.version === latestVersion
			? `v${activeRelease.version} (latest)`
			: `v${activeRelease.version}`
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
						{otherVersions.map((version: string) => {
							const href =
								latestVersion === version
									? `/${productSlug}/integrations/${integrationSlug}`
									: `/${productSlug}/integrations/${integrationSlug}/${version}`
							return (
								<DropdownDisclosureLinkItem key={version} href={href}>
									v{version}
								</DropdownDisclosureLinkItem>
							)
						})}
					</DropdownDisclosure>
				) : null}
			</div>
		</div>
	)
}
