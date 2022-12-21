import Tabs, { Tab } from 'components/tabs'
import {
	ReleaseComponent,
	Variable as ApiVariable,
	VariableGroup,
} from 'lib/integrations-api-client/release'
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'
import defaultMdxComponents from 'layouts/sidebar-sidecar/utils/_local_platform-docs-mdx'
import SearchableVariableGroupList from '../../../product-integration/component-view/components/searchable-variable-group-list'
import { Variable } from '../../../product-integration/component-view/components/variable-group-list'
import s from './style.module.css'

interface ComponentTabContentProps {
	component: ReleaseComponent & { readmeMdxSource: MDXRemoteSerializeResult }
}

export default function ComponentTabContent({
	component,
}: ComponentTabContentProps) {
	const readmeContent = (
		<MDXRemote
			{...component.readmeMdxSource}
			components={defaultMdxComponents({})}
		/>
	)
	return (
		<div className={s.componentTabContent}>
			{component.readmeMdxSource ? (
				<div className={s.mdx_wrapper}>{readmeContent}</div>
			) : null}
			{component.variable_groups.length ? (
				<Tabs allowNestedStyles>
					{component.variable_groups.map((variableGroup: VariableGroup) => {
						return (
							<Tab
								key={variableGroup.id}
								heading={variableGroup.variable_group_config.name}
							>
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
							</Tab>
						)
					})}
				</Tabs>
			) : (
				<></>
			)}
		</div>
	)
}
