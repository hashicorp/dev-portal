/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	TutorialVariant as ClientTutorialVariant,
	TutorialVariantOption as ClientTutorialVariantOption,
} from 'lib/learn-client/types'

export interface TutorialVariant extends ClientTutorialVariant {
	activeOption: TutorialVariantOption
}

export type TutorialVariantOption = ClientTutorialVariantOption
