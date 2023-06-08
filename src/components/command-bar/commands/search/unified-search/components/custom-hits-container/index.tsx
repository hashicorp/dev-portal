/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect } from 'react'
import { useHits } from 'react-instantsearch-hooks-web'
import { CommandBarList } from 'components/command-bar/components'
import { useHitsContext } from '../../../helpers'
import { CustomHitsContainerProps } from './types'
import s from './custom-hits-container.module.css'
import { UnifiedHit } from '../unified-hit'

const CustomHitsContainer = ({
	integrationsHits = [],
	noResultsSlot,
	type,
}: CustomHitsContainerProps) => {
	const [hitCounts, setHitCounts] = useHitsContext()
	const { hits } = useHits()

	/**
	 * When hits within this index context are updated,
	 * Update the <HitCountsProvider /> data for this content type.
	 */
	useEffect(() => {
		const hitsCount = hits.length
		const needsUpdate = hitCounts[type] !== hitsCount
		if (needsUpdate && typeof setHitCounts === 'function') {
			setHitCounts({ ...hitCounts, [type]: hitsCount })
		}
	}, [type, hits, integrationsHits, hitCounts, setHitCounts])

	const shouldShowNoResultsSlot = hits && hits.length <= 0
	if (shouldShowNoResultsSlot) {
		return <>{noResultsSlot}</>
	}

	const labelElementId = `${type}-search-results-label`
	return (
		<>
			<div id={labelElementId} className="g-screen-reader-only">
				{type} search results
			</div>
			<div className={s.comandBarListWrapper}>
				<CommandBarList ariaLabelledBy={labelElementId}>
					{hits.map((hit: $TSFixMe) => {
						return <UnifiedHit key={hit.objectID} hit={hit} />
					})}
				</CommandBarList>
			</div>
		</>
	)
}

export type { CustomHitsContainerProps }
export { CustomHitsContainer }
