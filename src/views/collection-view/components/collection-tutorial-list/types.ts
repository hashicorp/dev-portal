/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { TutorialCardPropsWithId } from 'components/tutorial-card/types'

export interface CollectionTutorialListProps {
	tutorials: TutorialCardPropsWithId[]
	isOrdered: boolean
}
