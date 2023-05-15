/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { CommandBarTag } from 'components/command-bar/types'
import { Integration } from 'lib/integrations-api-client/integration'

interface IntegrationsTabContentsProps {
	currentProductTag?: CommandBarTag
	activeTabIndex: number
	setActiveTabIndex: (index: number) => void
	tabData: $TSFixMe
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
