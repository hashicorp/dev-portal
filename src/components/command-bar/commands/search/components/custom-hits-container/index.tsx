import { useHits } from 'react-instantsearch-hooks-web'
import { CommandBarList } from 'components/command-bar/components'
import { CustomHitsContainerProps } from './types'
import {
	DocumentationHit,
	DocumentationHitObject,
	TutorialHit,
	TutorialHitObject,
} from '../'

const CustomHitsContainer = ({
	noResultsSlot,
	type,
}: CustomHitsContainerProps) => {
	const { hits } = useHits<DocumentationHitObject | TutorialHitObject>()

	if (hits && hits.length <= 0) {
		return <>{noResultsSlot}</>
	}

	const labelElementId = `${type}-search-results-label`
	return (
		<>
			<div id={labelElementId} className="g-screen-reader-only">
				{type} search results
			</div>
			<CommandBarList ariaLabelledBy={labelElementId}>
				{hits.map((hit: DocumentationHitObject | TutorialHitObject) => {
					let hitObject

					if (type === 'documentation') {
						hitObject = hit as DocumentationHitObject
						return <DocumentationHit key={hitObject.objectID} hit={hitObject} />
					}

					if (type === 'tutorials') {
						hitObject = hit as TutorialHitObject
						return <TutorialHit key={hitObject.objectID} hit={hitObject} />
					}
				})}
			</CommandBarList>
		</>
	)
}

export type { CustomHitsContainerProps }
export default CustomHitsContainer
