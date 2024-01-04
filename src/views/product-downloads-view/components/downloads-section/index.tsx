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
import classNames from 'classnames'
import { ContentWithPermalink } from 'views/open-api-docs-view/components/content-with-permalink'
import viewStyles from 'views/product-downloads-view/product-downloads-view.module.css'
import { PackageManager } from 'views/product-downloads-view/types'
import CardWithLink from '../card-with-link'
import s from './downloads-section.module.css'
import { groupPackageManagersByOS } from './helpers'
import { groupDownloadsByOS } from '../../helpers'
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
			{Object.keys(downloadsByOS).map((os) => {
				const packageManagers = packageManagersByOS[os]
				const prettyOSName = prettyOs(os)
				const prettyOsId = prettyOSName.replace(' ', '-')

				return (
					<Card className={s.card} elevation="base" key={os}>
						<ContentWithPermalink
							className={s.headingContainer}
							id={prettyOsId}
							ariaLabel={prettyOSName}
						>
							<Heading
								className={classNames(s.heading, viewStyles.scrollHeading)}
								level={2}
								size={400}
								id={prettyOsId}
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
								os={os}
								prettyOSName={prettyOSName}
								selectedRelease={selectedRelease}
							/>
						</div>
					</Card>
				)
			})}
		</>
	)
}

export default DownloadsSection
