import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { MdxH2 } from 'components/dev-dot-content/mdx-components'
import ProductIntegrationLayout from 'layouts/product-integration-layout'
import defaultMdxComponents from 'layouts/sidebar-sidecar/utils/_local_platform-docs-mdx'
import { getIntegrationComponentUrl } from 'lib/integrations'
import { Integration } from 'lib/integrations-api-client/integration'
import {
	Variable as ApiVariable,
	Release,
	ReleaseComponent,
	VariableGroup,
} from 'lib/integrations-api-client/release'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { ProductData } from 'types/products'
import SearchableVariableGroupList from './components/searchable-variable-group-list'
import { Variable } from './components/variable-group-list'
import s from './style.module.css'

export interface ProductIntegrationComponentViewProps {
	product: ProductData
	integration: Integration
	activeRelease: Release
	component: ReleaseComponent
	serializedREADME?: MDXRemoteSerializeResult
	breadcrumbLinks: BreadcrumbLink[]
}

export default function ProductIntegrationComponentView({
	product,
	integration,
	activeRelease,
	component,
	serializedREADME,
	breadcrumbLinks,
}: ProductIntegrationComponentViewProps) {
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
		>
			{serializedREADME ? (
				<div className={s.mdxWrapper}>
					<MDXRemote
						{...serializedREADME}
						components={defaultMdxComponents({})}
					/>
				</div>
			) : (
				<></>
			)}
			{component.variable_groups.length ? (
				<div className={s.variableGroups}>
					{component.variable_groups.map((variableGroup: VariableGroup) => {
						return (
							<div key={variableGroup.id}>
								{/* Note: using MDX heading here to match adjacent content */}
								<MdxH2>{variableGroup.variable_group_config.name}</MdxH2>
								<SearchableVariableGroupList
									groupName={variableGroup.variable_group_config.name}
									variables={variableGroup.variables.map(
										(variable: ApiVariable): Variable => {
											return {
												key: variable.key,
												type: variable.type,
												description: variable.description,
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
