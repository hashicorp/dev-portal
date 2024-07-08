/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import { ReactElement, useMemo } from 'react'

// HashiCorp imports
import CodeBlock from '@hashicorp/react-design-system-components/src/components/code-block'
import { IconInfo16 } from '@hashicorp/flight-icons/svg-react/info-16'

// Global imports
import Card from 'components/card'
import Heading, { HeadingProps } from 'components/heading'
import Tabs, { Tab } from 'components/tabs'
import MobileDownloadStandaloneLink from 'components/mobile-download-standalone-link'
import InlineAlert from 'components/inline-alert'
import InlineLink from 'components/inline-link'
import { trackProductDownload } from 'lib/analytics'
import { useCurrentVersion } from 'views/product-downloads-view/contexts'
import { prettyOs } from 'views/product-downloads-view/helpers'

// Local imports
import classNames from 'classnames'
import { ContentWithPermalink } from 'views/open-api-docs-view/components/content-with-permalink'
import viewStyles from 'views/product-downloads-view/product-downloads-view.module.css'
import { PackageManager } from 'views/product-downloads-view/types'
import CardWithLink from '../card-with-link'
import s from './downloads-section.module.css'
import { groupPackageManagersByOS } from './helpers'
import { DownloadsSectionProps } from './types'

const SHARED_HEADING_LEVEL_3_PROPS = {
	className: s.subheading,
	level: 3 as HeadingProps['level'],
	size: 200 as HeadingProps['size'],
	weight: 'semibold' as HeadingProps['weight'],
}

const PackageManagerSection = ({
	packageManagers,
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
			<Heading {...SHARED_HEADING_LEVEL_3_PROPS}>Package manager</Heading>
			{hasOnePackageManager && (
				<CodeBlock
					className={s.codeBlock}
					value={packageManagers[0].installCodeHtml}
					language="shell-session"
					hasCopyButton
					hasLineNumbers={false}
				/>
			)}
			{hasManyPackageManagers && (
				<div className={s.codeBlocks}>
					<Tabs>
						{packageManagers.map(({ label, installCodeHtml }) => {
							return (
								<Tab key={label} heading={label}>
									<CodeBlock
										value={installCodeHtml}
										language="shell-session"
										hasCopyButton
										hasLineNumbers={false}
									/>
								</Tab>
							)
						})}
					</Tabs>
				</div>
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
			<Heading {...SHARED_HEADING_LEVEL_3_PROPS}>Binary download</Heading>
			<div className={s.downloadContainer}>
				{Object.keys(downloadsByOS[os]).map((arch) => (
					<CardWithLink
						className={s.downloadCard}
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
	packageManagers,
	selectedRelease,
	downloadsByOS,
}: DownloadsSectionProps): ReactElement => {
	const { isLatestVersion } = useCurrentVersion()
	const packageManagersByOS = useMemo(
		() => groupPackageManagersByOS(packageManagers),
		[packageManagers]
	)

	return (
		<>
			{Object.keys(downloadsByOS).map((osKey: string) => {
				const packageManagers = packageManagersByOS[osKey]
				const prettyOSName = prettyOs(osKey)

				return (
					<Card className={s.card} elevation="base" key={osKey}>
						<ContentWithPermalink
							className={s.headingContainer}
							id={osKey}
							ariaLabel={prettyOSName}
						>
							<Heading
								id={osKey}
								className={classNames(s.heading, viewStyles.scrollHeading)}
								level={2}
								size={400}
								weight="bold"
							>
								{prettyOSName}
							</Heading>
						</ContentWithPermalink>
						<div className={s.tabContent}>
							{isLatestVersion && (
								<PackageManagerSection
									packageManagers={packageManagers}
									prettyOSName={prettyOSName}
								/>
							)}
							<BinaryDownloadsSection
								downloadsByOS={downloadsByOS}
								os={osKey}
								prettyOSName={prettyOSName}
								selectedRelease={selectedRelease}
							/>
							{osKey === 'linux' && (
								<InlineAlert
									className={s.alert}
									color="neutral"
									title="Note"
									description={
										<>
											Complete this{' '}
											<InlineLink
												href="/well-architected-framework/operational-excellence/verify-hashicorp-binary"
												textSize={200}
											>
												tutorial
											</InlineLink>{' '}
											to learn how to install and verify HashiCorp tools on any
											Linux distribution, and create a custom Linux container
											with verified HashiCorp tools..
										</>
									}
									icon={<IconInfo16 className={s.cardIcon} />}
								/>
							)}
						</div>
					</Card>
				)
			})}
		</>
	)
}

export default DownloadsSection
