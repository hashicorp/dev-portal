/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { CommandBarTag } from 'components/command-bar/types'
import { Integration } from 'lib/integrations-api-client/integration'
import { NoResultsMessageProps } from '../no-results-message'

interface IntegrationsTabContentsProps {
	currentProductTag?: CommandBarTag
	noResultsProps: NoResultsMessageProps
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
