// Third-party imports
import { ReactElement, useMemo } from 'react'
import classNames from 'classnames'

// HashiCorp imports
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import { IconExternalLink24 } from '@hashicorp/flight-icons/svg-react/external-link-24'
import { IconInfo24 } from '@hashicorp/flight-icons/svg-react/info-24'
import CodeBlock from '@hashicorp/react-code-block'
import CodeTabs from '@hashicorp/react-code-block/partials/code-tabs'

// Global imports
import { trackProductDownload } from 'lib/analytics'
import { useCurrentProduct } from 'contexts'
import { prettyOs } from 'views/product-downloads-view/helpers'
import { useCurrentVersion } from 'views/product-downloads-view/contexts'
import Card from 'components/card'
import MobileDownloadStandaloneLink from 'components/mobile-download-standalone-link'
import Heading, { HeadingProps } from 'components/heading'
import InlineLink from 'components/inline-link'
import MobileStandaloneLink from 'components/mobile-standalone-link'
import Tabs, { Tab } from 'components/tabs'
import Text from 'components/text'
import VersionContextSwitcher from 'components/version-context-switcher'

// Local imports
import { DownloadsSectionProps } from './types'
import { groupDownloadsByOS, groupPackageManagersByOS } from './helpers'
import s from './downloads-section.module.css'
import { PackageManager } from 'views/product-downloads-view/types'

const SHARED_HEADING_LEVEL_3_PROPS = {
	className: s.subHeading,
	level: 3 as HeadingProps['level'],
	size: 200 as HeadingProps['size'],
	weight: 'semibold' as HeadingProps['weight'],
}

const PackageManagerSection = ({
	packageManagers,
	prettyOSName,
}: {
	packageManagers: PackageManager[]
	prettyOSName: string
}) => {
	const hasOnePackageManager = packageManagers?.length === 1
	const hasManyPackageManagers = packageManagers?.length > 1
	const hasPackageManagers = hasOnePackageManager || hasManyPackageManagers

	if (!hasPackageManagers) {
		return null
	}

	return (
		<>
			<Heading
				{...SHARED_HEADING_LEVEL_3_PROPS}
				id={`package-manager-for-${prettyOSName}`}
			>
				Package manager for {prettyOSName}
			</Heading>
			{hasOnePackageManager && (
				<CodeBlock
					code={packageManagers[0].installCodeHtml}
					language="shell-session"
					options={{ showClipboard: true }}
				/>
			)}
			{hasManyPackageManagers && (
				<CodeTabs tabs={packageManagers.map(({ label }) => label)}>
					{packageManagers.map(({ label, installCodeHtml }) => {
						return (
							<CodeBlock
								key={label}
								className={s.codeTabsCodeBlock}
								code={installCodeHtml}
								language="shell-session"
								options={{ showClipboard: true }}
							/>
						)
					})}
				</CodeTabs>
			)}
		</>
	)
}

const BinaryDownloadsSection = ({
	downloadsByOS,
	os,
	prettyOSName,
	selectedRelease,
}) => {
	const { name, version } = selectedRelease
	return (
		<>
			<Heading
				{...SHARED_HEADING_LEVEL_3_PROPS}
				id={`binary-download-for-${prettyOSName}`}
			>
				Binary download for {prettyOSName}
			</Heading>
			{Object.keys(downloadsByOS[os]).map((arch) => (
				<Card className={s.textAndLinkCard} elevation="base" key={arch}>
					<div className={s.textAndLinkCardTextContainer}>
						<Text
							className={s.textAndLinkCardLabel}
							size={200}
							weight="semibold"
						>
							{arch.toUpperCase()}
						</Text>
						<Text
							className={s.textAndLinkCardVersionLabel}
							size={200}
							weight="regular"
						>
							Version: {version}
						</Text>
					</div>
					<MobileDownloadStandaloneLink
						ariaLabel={`download ${name} version ${version} for ${prettyOSName}, architecture ${arch}`}
						href={downloadsByOS[os][arch]}
						onClick={() => {
							trackProductDownload({
								productSlug: name,
								version,
								prettyOSName,
								architecture: arch,
							})
						}}
					/>
				</Card>
			))}
		</>
	)
}

const ChangelogSection = ({ selectedRelease }) => {
	const { name, version } = selectedRelease
	return (
		<>
			<Heading {...SHARED_HEADING_LEVEL_3_PROPS} id="release-information">
				Release information
			</Heading>
			<Card className={s.textAndLinkCard} elevation="base">
				<div className={s.textAndLinkCardTextContainer}>
					<Text className={s.textAndLinkCardLabel} size={200} weight="semibold">
						Changelog
					</Text>
					<Text
						className={s.textAndLinkCardVersionLabel}
						size={200}
						weight="regular"
					>
						Version: {version}
					</Text>
				</div>
				<MobileStandaloneLink
					ariaLabel={`${name} version ${version} changelog`}
					href={`https://github.com/hashicorp/${name}/blob/v${version}/CHANGELOG.md`}
					size16Icon={<IconExternalLink16 />}
					size24Icon={<IconExternalLink24 />}
					iconPosition="trailing"
					openInNewTab
					text="GitHub"
				/>
			</Card>
		</>
	)
}

const NotesSection = ({ selectedRelease }) => {
	const currentProduct = useCurrentProduct()
	const { name, shasums, shasums_signature, version } = selectedRelease

	return (
		<>
			<Heading
				{...SHARED_HEADING_LEVEL_3_PROPS}
				className={classNames(
					SHARED_HEADING_LEVEL_3_PROPS.className,
					s.specialSubHeading
				)}
				id="notes"
			>
				Notes
			</Heading>
			<Text size={200}>
				You can find the{' '}
				<InlineLink
					href={`https://releases.hashicorp.com/${name}/${version}/${shasums}`}
					textSize={200}
				>
					SHA256 checksums for {currentProduct.name} {version}
				</InlineLink>{' '}
				online and you can{' '}
				<InlineLink
					href={`https://releases.hashicorp.com/${name}/${version}/${shasums_signature}`}
					textSize={200}
				>
					verify the checksums signature file
				</InlineLink>{' '}
				which has been signed using{' '}
				<InlineLink href="https://www.hashicorp.com/security" textSize={200}>
					{"HashiCorp's GPG key"}
				</InlineLink>
				.
			</Text>
		</>
	)
}

/**
 * @TODO replace with InlineAlert
 * ref: https://design-system-components-hashicorp.vercel.app/components/alert
 */
const EnterpriseLegalNotice = () => {
	return (
		<div className={s.enterpriseLegalNotice}>
			<IconInfo24 className={s.enterpriseLegalNoticeIcon} />
			<div>
				<Text
					asElement="p"
					className={s.enterpriseLegalNoticeTitle}
					size={200}
					weight="semibold"
				>
					Terms of use
				</Text>
				<Text
					asElement="p"
					className={s.enterpriseLegalNoticeText}
					size={200}
					weight="regular"
				>
					The following shall apply unless your organization has a separately
					signed Enterprise License Agreement or Evaluation Agreement governing
					your use of the package: Enterprise packages in this repository are
					subject to the license terms located in the package. Please read the
					license terms prior to using the package. Your installation and use of
					the package constitutes your acceptance of these terms. If you do not
					accept the terms, do not use the package.
				</Text>
			</div>
		</div>
	)
}

const DownloadsSection = ({
	isEnterpriseMode = false,
	packageManagers,
	selectedRelease,
	versionSwitcherOptions,
}: DownloadsSectionProps): ReactElement => {
	const { isLatestVersion, setCurrentVersion } = useCurrentVersion()
	const downloadsByOS = useMemo(
		() => groupDownloadsByOS(selectedRelease),
		[selectedRelease]
	)
	const packageManagersByOS = useMemo(
		() => groupPackageManagersByOS(packageManagers),
		[packageManagers]
	)

	return (
		<div className={s.root}>
			<Card elevation="base">
				<div className={s.cardHeader}>
					<div className={s.versionSwitcherWrapper}>
						<VersionContextSwitcher
							onChange={(e) => setCurrentVersion(e.target.value)}
							options={versionSwitcherOptions}
						/>
					</div>
					<Heading
						className={s.operatingSystemTitle}
						level={2}
						size={300}
						id="operating-system"
						weight="bold"
					>
						Operating System
					</Heading>
				</div>
				<Tabs showAnchorLine>
					{Object.keys(downloadsByOS).map((os) => {
						const packageManagers = packageManagersByOS[os]
						const prettyOSName = prettyOs(os)

						/**
						 * TODO: it might be nice to introduce a local Context here with all
						 * the information needed so that these helper components don't have
						 * APIs that could potentially require changes with every visual
						 * change.
						 */
						return (
							<Tab heading={prettyOSName} key={os}>
								<div className={s.tabContent}>
									{isLatestVersion && (
										<PackageManagerSection
											packageManagers={packageManagers}
											prettyOSName={prettyOSName}
										/>
									)}
									<BinaryDownloadsSection
										downloadsByOS={downloadsByOS}
										os={os}
										prettyOSName={prettyOSName}
										selectedRelease={selectedRelease}
									/>
									<ChangelogSection selectedRelease={selectedRelease} />
									<NotesSection selectedRelease={selectedRelease} />
									{isEnterpriseMode ? <EnterpriseLegalNotice /> : null}
								</div>
							</Tab>
						)
					})}
				</Tabs>
			</Card>
		</div>
	)
}

export default DownloadsSection
