import Tabs, { Tab } from 'components/tabs'
import {
	ReleaseComponent,
	VariableGroup,
	Variable as ApiVariable,
} from 'lib/integrations-api-client/release'
import SearchableVariableGroupList from '../searchable-variable-group-list'
import { Variable } from '../variable-group-list'
import s from './style.module.css'
import ReactMarkdown from 'react-markdown'

interface ComponentTabContentProps {
	component: ReleaseComponent
}

export default function ComponentTabContent({
	component,
}: ComponentTabContentProps) {
	return (
		<div className={s.componentTabContent}>
			{component.readme && <ReactMarkdown>{component.readme}</ReactMarkdown>}
			{component.variable_groups.length && (
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
												required: variable.required
													? variable.required
													: undefined,
											}
										}
									)}
								/>
							</Tab>
						)
					})}
				</Tabs>
			)}
		</div>
	)
}

const OUTPUTS_FIXTURE: Array<Variable> = [
	{
		key: 'architecture',
		type: 'string',
	},
	{
		key: 'image',
		type: 'string',
	},
	{
		key: 'location',
		type: 'docker.isImage_Location',
	},
	{
		key: 'tag',
		type: 'string',
	},
]

const PARAMS_FIXTURE: Array<Variable> = [
	{
		key: 'auth',
		type: 'object',
		description:
			'The authentication information to log into the docker repository.',
	},
	{
		key: 'auth.auth',
		type: 'string',
	},

	{
		key: 'auth.example',
		type: 'object',
	},
	{
		key: 'auth.example.foobar',
		type: 'string',
	},
	{
		key: 'auth.email',
		type: 'string',
	},
	{
		key: 'auth.hostname',
		type: 'string',
		description: 'Hostname of Docker registry.',
	},
	{
		key: 'auth.identityToken',
		type: 'string',
		description: 'Token used to authenticate user.',
	},
	{
		key: 'build_args',
		type: 'map of string to string',
		description: `Build args to pass to docker for the build step.

A map of key/value pairs passed as build-args to docker for the build step.`,
	},
	{
		key: 'buildkit',
		type: 'bool',
		description: 'If set, use the buildkit builder from Docker.',
	},
	{
		key: 'context',
		type: 'string',
		description: 'Build context path.',
	},
]
