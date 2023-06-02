/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect } from 'react'
import { useHits } from 'react-instantsearch-hooks-web'
import { CommandBarList } from 'components/command-bar/components'
import { useHitsContext } from '../../../helpers'
import { CustomHitsContainerProps } from './types'
import {
	DocumentationHit,
	DocumentationHitObject,
	TutorialHit,
	TutorialHitObject,
} from '../'
import s from './custom-hits-container.module.css'
import { UnifiedHit } from '../unified-hit'

const CustomHitsContainer = ({
	integrationsHits = [],
	noResultsSlot,
	type,
}: CustomHitsContainerProps) => {
	const [hitCounts, setHitCounts] = useHitsContext()
	const { hits } = useHits<DocumentationHitObject | TutorialHitObject>()

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
					{hits.map(
						(hit: DocumentationHitObject | TutorialHitObject | $TSFixMe) => {
							let hitObject

							// TODO: all content types could use a unified hit type
							// return <UnifiedHit key={hit.objectID} hit={hit} />

							if (type === 'all' || type === 'integrations') {
								return <UnifiedHit key={hit.objectID} hit={hit} />
							}

							if (type === 'docs') {
								hitObject = hit as DocumentationHitObject
								return (
									<DocumentationHit key={hitObject.objectID} hit={hitObject} />
								)
							}

							if (type === 'tutorials') {
								hitObject = hit as TutorialHitObject
								return <TutorialHit key={hitObject.objectID} hit={hitObject} />
							}
						}
					)}
				</CommandBarList>
			</div>
		</>
	)
}

export type { CustomHitsContainerProps }
export default CustomHitsContainer
