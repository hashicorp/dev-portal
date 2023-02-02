import Button from 'components/button'
import Heading from 'components/heading'
import Text from 'components/text'
import Card from 'components/card'
import DropdownDisclosure, {
	DropdownDisclosureLinkItem,
} from 'components/dropdown-disclosure'
import IconTileLogo from 'components/icon-tile-logo'
import Badge from 'components/badge'
import Tooltip from 'components/tooltip'
import TruncateMaxLines from 'components/truncate-max-lines'
import { useDeviceSize } from 'contexts'
import { Integration, Flag } from 'lib/integrations-api-client/integration'
import { Release } from 'lib/integrations-api-client/release'
import TagList, {
	GetIntegrationTags,
	Tag,
} from 'views/product-integrations-landing/components/tag-list'
import { ProductSlug } from 'types/products'
import s from './style.module.css'

interface HeaderProps {
	className?: string
	integration: Integration
	activeRelease: Release
	productSlug: ProductSlug
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
	integration,
	activeRelease,
	productSlug,
	onInstallClicked,
	getVersionChangedURL,
}: HeaderProps) {
	const { isMobile } = useDeviceSize()

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

	const tags = GetIntegrationTags(integration, true)

	return (
		<Card elevation="base" className={s.headerWrap}>
			<IconTileLogo
				className={s.iconTile}
				size="large"
				productSlug={productSlug !== 'sentinel' ? productSlug : null}
			/>
			<div className={s.upper}>
				<div className={s.titleDescriptionWrap}>
					<div className={s.titleWrap}>
						<TruncateMaxLines
							maxLines={isMobile ? 2 : 1}
							lineHeight="var(--token-typography-body-300-line-height)"
						>
							<Heading
								size={300}
								weight="bold"
								level={1}
								className={s.titleName}
							>
								{integration.name}
							</Heading>
						</TruncateMaxLines>
						<Text size={100} weight="medium" className={s.titleOrganization}>
							@{integration.organization.slug}
						</Text>
					</div>
					<TruncateMaxLines
						maxLines={2}
						lineHeight="var(--token-typography-body-200-line-height)"
					>
						<Text size={200} className={s.description}>
							{integration.description}
						</Text>
					</TruncateMaxLines>
				</div>
				{showVersions ? (
					<DropdownDisclosure
						className={s.versionSelector}
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
			<div className={s.lower}>
				<TagList tags={tags} type="outlined" />
				{shouldShowInstallButton && (
					<Button
						size={isMobile ? 'medium' : 'small'}
						className={s.installButton}
						text="Install"
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
