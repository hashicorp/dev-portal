/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { TutorialCardsGridList } from 'components/cards-grid-list'
import { CollectionTutorialListProps } from './types'
import s from './collection-tutorial-list.module.css'

function CollectionTutorialList({
	tutorials,
	isOrdered,
}: CollectionTutorialListProps) {
	return (
		<div className={s.root}>
			<TutorialCardsGridList
				fixedColumns={isOrdered ? 1 : null}
				isOrdered={isOrdered}
				tutorials={tutorials}
			/>
		</div>
	)
}

export default CollectionTutorialList
