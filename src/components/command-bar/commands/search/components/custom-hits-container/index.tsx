/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect } from 'react'
import { useHits } from 'react-instantsearch-hooks-web'
import { CommandBarList } from 'components/command-bar/components'
import { CustomHitsContainerProps } from './types'
import {
	DocumentationHit,
	DocumentationHitObject,
	IntegrationHit,
	IntegrationHitObject,
	TutorialHit,
	TutorialHitObject,
} from '../'
import s from './custom-hits-container.module.css'
import { useHitCountsContext } from '../../helpers/hit-counts-provider'

const CustomHitsContainer = ({
	integrationsHits = [],
	noResultsSlot,
	type,
}: CustomHitsContainerProps) => {
	const [hitCounts, setHitCounts] = useHitCountsContext()
	const { hits } = useHits<DocumentationHitObject | TutorialHitObject>()

	/**
	 * TODO: this hitCounts stuff is spiked in without regard for efficiency,
	 * could probably use a lot of refinement.
	 */
	useEffect(() => {
		const updatedHitCount =
			type === 'integrations' ? integrationsHits.length : hits.length
		if (hitCounts[type] === updatedHitCount) {
			return
		}
		if (typeof setHitCounts === 'function') {
			setHitCounts({ ...(hitCounts || {}), [type]: updatedHitCount })
		}
	}, [hits, integrationsHits, type])

	const shouldShowNoResultsSlot =
		type === 'integrations'
			? integrationsHits && integrationsHits.length <= 0
			: hits && hits.length <= 0
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
					{type === 'integrations'
						? integrationsHits.map((hit: IntegrationHitObject) => (
								<IntegrationHit key={hit.id} hit={hit} />
						  ))
						: hits.map((hit: DocumentationHitObject | TutorialHitObject) => {
								let hitObject

								if (type === 'docs') {
									hitObject = hit as DocumentationHitObject
									return (
										<DocumentationHit
											key={hitObject.objectID}
											hit={hitObject}
										/>
									)
								}

								if (type === 'tutorials') {
									hitObject = hit as TutorialHitObject
									return (
										<TutorialHit key={hitObject.objectID} hit={hitObject} />
									)
								}
						  })}
				</CommandBarList>
			</div>
		</>
	)
}

export type { CustomHitsContainerProps }
export default CustomHitsContainer
