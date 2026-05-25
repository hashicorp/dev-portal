/**
 * Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductOption } from 'lib/learn-client/types'

export type CardBadgeOption = ProductOption | 'video' | 'interactive'

export interface CardBadgesProps {
	badges: CardBadgeOption[]
}
