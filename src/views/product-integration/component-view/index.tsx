/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { BreadcrumbLink } from 'components/breadcrumb-bar'
import DevDotContent from 'components/dev-dot-content'
import { MdxHeadingOutsideMdx } from './components/mdx-heading-outside-mdx'
import ProductIntegrationLayout from 'layouts/product-integration-layout'
import { TableOfContentsHeading } from 'components/table-of-contents'
import { OutlineNavFromHeadings } from 'components/outline-nav/components'
import { getIntegrationComponentUrl } from 'lib/integrations'
import { Integration } from 'lib/integrations-api-client/integration'
import {
	Variable as ApiVariable,
	Release,
	ReleaseComponent,
	VariableGroup,
} from 'lib/integrations-api-client/release'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { ProductData } from 'types/products'
import SearchableVariableGroupList from './components/searchable-variable-group-list'
import { Variable } from './components/variable-group-list'
import { getVariableGroupSlug, getVariableSlug } from './helpers'
import type { ProcessedVariablesMarkdown } from './helpers/get-processed-variables-markdown'
import s from './style.module.css'
import VersionAlertBanner from 'components/version-alert-banner'

export interface ProductIntegrationComponentViewProps {
	product: ProductData
	integration: Integration
	activeRelease: Release
	component: ReleaseComponent
	serializedREADME?: MDXRemoteSerializeResult
	breadcrumbLinks: BreadcrumbLink[]
	processedVariablesMarkdown: ProcessedVariablesMarkdown
}

export default function ProductIntegrationComponentView({
	product,
	integration,
	activeRelease,
	component,
	serializedREADME,
	breadcrumbLinks,
	processedVariablesMarkdown,
}: ProductIntegrationComponentViewProps) {
	const { variable_groups } = component
	/**
	 * Build variable group headings, which are used for both
	 * the table of contents and to render the headings themselves
	 */
	const variableGroupHeadings: TableOfContentsHeading[] = variable_groups
		.map((variableGroup: VariableGroup) => {
			const groupName = variableGroup.variable_group_config.name
			const variableHeadings = variableGroup.variables.map((v) => {
				return {
					title: v.key,
					slug: getVariableSlug(groupName, v.key),
					level: 3 as const,
				}
			})
			const slug = getVariableGroupSlug(groupName)
			return [
				{ title: groupName, slug, level: 2 as const },
				...variableHeadings,
			]
		})
		.flat()

	/**
	 * Grab the current version string from the activeRelease.
	 */
	const currentVersion = activeRelease.version
	const isLatestVersion = currentVersion === integration.versions[0]

	return (
		<ProductIntegrationLayout
			className={s.integrationComponentView}
			title={`${integration.name} ${component.component.name}`}
			breadcrumbLinks={breadcrumbLinks}
			currentProduct={product}
			integration={integration}
			activeRelease={activeRelease}
			getVersionChangedURL={(version: string) => {
				const versionString =
					version === integration.versions[0] ? 'latest' : version
				return getIntegrationComponentUrl(integration, component, versionString)
			}}
			sidecarSlot={<OutlineNavFromHeadings headings={variableGroupHeadings} />}
			alertBannerSlot={
				isLatestVersion ? null : (
					<VersionAlertBanner
						currentVersion={currentVersion}
						latestVersionUrl={getIntegrationComponentUrl(
							integration,
							component,
							currentVersion
						)}
					/>
				)
			}
		>
			{serializedREADME ? (
				<div className={s.mdxWrapper}>
					<DevDotContent mdxRemoteProps={serializedREADME} />
				</div>
			) : (
				<></>
			)}
			{variable_groups.length ? (
				<div className={s.variableGroups}>
					{variable_groups.map((variableGroup: VariableGroup, idx: number) => {
						const headingData = variableGroupHeadings[idx]

						return (
							<div key={variableGroup.id}>
								{/* Note: using MDX heading here to match adjacent content */}
								<MdxHeadingOutsideMdx
									id={headingData.slug}
									title={headingData.title}
									level={headingData.level}
								/>
								<SearchableVariableGroupList
									groupName={variableGroup.variable_group_config.name}
									variables={variableGroup.variables.map(
										(variable: ApiVariable): Variable => {
											const uniqueKey = `${variable.variable_group_id}.${variable.key}`
											const processedMarkdown =
												processedVariablesMarkdown[uniqueKey]
											return {
												key: variable.key,
												type: variable.type,
												/**
												 * Note: we pass description for search & filtering,
												 * and descriptionMdx for rendering.
												 */
												description: variable.description,
												descriptionMdx: processedMarkdown.description,
												required: variable.required,
											}
										}
									)}
								/>
							</div>
						)
					})}
				</div>
			) : null}
		</ProductIntegrationLayout>
	)
}
ProductIntegrationComponentView.contentType = 'integrations'
