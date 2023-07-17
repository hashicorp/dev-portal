/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import { IntegrationHitObject } from '../integrations-tab-contents/types'

interface CustomHitsContainerProps {
	integrationsHits?: IntegrationHitObject[]
	noResultsSlot: ReactNode
	type: 'docs' | 'tutorials' | 'integrations'
}

export type { CustomHitsContainerProps }
