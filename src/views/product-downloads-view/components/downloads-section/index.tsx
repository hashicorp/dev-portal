/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import { ReactElement, useMemo } from 'react'

// HashiCorp imports
import CodeBlock from '@hashicorp/react-code-block'
import CodeTabs from '@hashicorp/react-code-block/partials/code-tabs'

// Global imports
import Card from 'components/card'
import Heading, { HeadingProps } from 'components/heading'
import MobileDownloadStandaloneLink from 'components/mobile-download-standalone-link'
import { trackProductDownload } from 'lib/analytics'
import { useCurrentVersion } from 'views/product-downloads-view/contexts'
import { prettyOs } from 'views/product-downloads-view/helpers'

// Local imports
import { PackageManager } from 'views/product-downloads-view/types'
import ReleaseInformationSection from '../release-information'
import s from './downloads-section.module.css'
import { groupDownloadsByOS, groupPackageManagersByOS } from './helpers'
import { DownloadsSectionProps } from './types'
import CardWithLink from '../card-with-link'

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
				Package manager
			</Heading>
			{hasOnePackageManager && (
				<CodeBlock
					className={s.codeBlock}
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
								className={s.codeBlocks}
								key={label}
								code={installCodeHtml}
								language="shell-session"
								options={{ showClipboard: true, wrapCode: true }}
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
				Binary download
			</Heading>
			<div className={s.binaryDownloadContainer}>
				{Object.keys(downloadsByOS[os]).map((arch) => (
					<CardWithLink
						className={s.binaryCard}
						key={arch}
						heading={arch.toUpperCase()}
						subheading={`Version: ${version}`}
						link={
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
						}
					/>
				))}
			</div>
		</>
	)
}

const DownloadsSection = ({
	isEnterpriseMode = false,
	packageManagers,
	selectedRelease,
}: DownloadsSectionProps): ReactElement => {
	const { isLatestVersion } = useCurrentVersion()
	const downloadsByOS = useMemo(
		() => groupDownloadsByOS(selectedRelease),
		[selectedRelease]
	)
	const packageManagersByOS = useMemo(
		() => groupPackageManagersByOS(packageManagers),
		[packageManagers]
	)

	return (
		<>
			<div className={s.root}>
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
						<Card className={s.card} elevation="base" key={os}>
							<Heading
								className={s.operatingSystemTitle}
								level={2}
								size={400}
								id="operating-system"
								weight="bold"
							>
								{prettyOSName}
							</Heading>
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
							</div>
						</Card>
					)
				})}
			</div>
			<ReleaseInformationSection
				selectedRelease={selectedRelease}
				isEnterpriseMode={isEnterpriseMode}
			/>
		</>
	)
}

export default DownloadsSection
