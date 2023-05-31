/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import { CommandBarTag } from 'components/command-bar/types'
import { Integration } from 'lib/integrations-api-client/integration'

interface IntegrationsTabContentsProps {
	currentProductTag?: CommandBarTag
	noResultsMessageSlot: ReactNode
}

type IntegrationHitObject = Integration

interface IntegrationHitProps {
	hit: IntegrationHitObject
}

export type {
	IntegrationHitObject,
	IntegrationHitProps,
	IntegrationsTabContentsProps,
}
