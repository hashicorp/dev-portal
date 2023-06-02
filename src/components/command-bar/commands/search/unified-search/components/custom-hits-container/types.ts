/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import { SearchableContentType } from 'contexts'

interface CustomHitsContainerProps {
	integrationsHits?: $TSFixMe[]
	noResultsSlot: ReactNode
	type: SearchableContentType | 'all'
}

export type { CustomHitsContainerProps }
