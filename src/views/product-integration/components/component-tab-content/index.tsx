import Tabs, { Tab } from 'components/tabs'
import {
	EnrichedIntegrationReleaseComponent as ReleaseComponent,
	Variable as ApiVariable,
	EnrichedVariableGroup as VariableGroup,
} from 'lib/integrations-api-client'
import ReactMarkdown from 'react-markdown'
import SearchableVariableGroupList from '../searchable-variable-group-list'
import { Variable } from '../variable-group-list'
import s from './style.module.css'

interface ComponentTabContentProps {
	component: ReleaseComponent
}

export default function ComponentTabContent({
	component,
}: ComponentTabContentProps) {
	return (
		<div className={s.componentTabContent}>
			{component.readme && <ReactMarkdown>{component.readme}</ReactMarkdown>}
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
