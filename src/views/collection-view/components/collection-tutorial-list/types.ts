/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { TutorialCardPropsWithId } from 'components/tutorial-card/types'

export interface CollectionTutorialListProps {
	tutorials: TutorialCardPropsWithId[]
	isOrdered: boolean
}
