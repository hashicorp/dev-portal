import Tabs, { Tab } from 'components/tabs'
import { Component } from 'lib/integrations-api-client'
import { Variable, VariableGroupList } from '../variable-group-list'
import s from './style.module.css'

interface ComponentTabContentProps {
	component: Component
}

export default function ComponentTabContent({
	component,
}: ComponentTabContentProps) {
	return (
		<div className={s.componentTabContent}>
			<h3>{component.slug}</h3>
			<p>
				Ultrices in iaculis nunc sed. Pulvinar sapien et ligula ullamcorper
				malesuada proin libero nunc consequat.
			</p>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Pulvinar neque
				laoreet suspendisse interdum. Turpis massa sed elementum tempus egestas.
				Elementum tempus egestas sed sed. Arcu bibendum at varius vel pharetra
				vel turpis nunc. Vel facilisis volutpat est velit egestas dui id. Vitae
				sapien pellentesque habitant morbi tristique senectus et netus. Dolor
				sit amet consectetur adipiscing elit pellentesque habitant.
			</p>
			<Tabs allowNestedStyles>
				<Tab heading="Parameters">
					<VariableGroupList variables={VARS_FIXTURE} />
				</Tab>
				<Tab heading="Outputs">
					<VariableGroupList variables={VARS_FIXTURE} />
				</Tab>
			</Tabs>
		</div>
	)
}

export const VARS_FIXTURE: Array<Variable> = [
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
