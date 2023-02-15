/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { LogoCtaSlotProps } from '../logo-cta-slot/types'

export type VaultSlotProps = Omit<
	LogoCtaSlotProps,
	'backgroundSlot' | 'descriptionMaxWidth' | 'logoSrc'
>
