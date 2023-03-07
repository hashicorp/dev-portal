import { ReactNode } from 'react'
import { Integration } from 'lib/integrations-api-client/integration'

interface IntegrationsSearchProviderProps {
	children: ReactNode
	integrations: Integration[]
}

export type { IntegrationsSearchProviderProps }
