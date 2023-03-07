import { ReactNode } from 'react'
import {
	Flag,
	Integration,
	IntegrationComponent,
	Tier,
} from 'lib/integrations-api-client/integration'

interface IntegrationsSearchProviderProps {
	allComponents: Array<IntegrationComponent>
	allFlags: Array<Flag>
	allTiers: Array<Tier>
	children: ReactNode
	integrations: Integration[]
}

export type { IntegrationsSearchProviderProps }
