/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import { SearchableContentType } from 'contexts'
import { IntegrationHitObject } from '../integrations-tab-contents/types'

interface CustomHitsContainerProps {
	integrationsHits?: IntegrationHitObject[]
	noResultsSlot: ReactNode
	type: SearchableContentType
}

export type { CustomHitsContainerProps }
