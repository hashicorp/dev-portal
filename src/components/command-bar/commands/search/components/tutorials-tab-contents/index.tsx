import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconGuide16 } from '@hashicorp/flight-icons/svg-react/guide-16'
import { productSlugsToNames } from 'lib/products'
import Card from 'components/card'
import {
	CommandBarList,
	CommandBarLinkListItem,
} from 'components/command-bar/components'
import StandaloneLink from 'components/standalone-link'
import Text from 'components/text'
import NoResultsMessage from '../no-results-message'
import { TutorialsTabContentsProps } from './types'
import s from './tutorials-tab-contents.module.css'

const TutorialsTabContents = ({
	searchResults,
	tutorialLibraryCta,
}: TutorialsTabContentsProps) => {
	return searchResults.length === 0 ? (
		<>
			<NoResultsMessage />
			<Card className={s.cta} elevation="base">
				<IconGuide16 className={s.ctaIcon} />
				<Text asElement="span" className={s.ctaText} size={200} weight="medium">
					{tutorialLibraryCta.text}
				</Text>
				<StandaloneLink
					href={tutorialLibraryCta.href}
					icon={<IconArrowRight16 />}
					iconPosition="trailing"
					size="small"
					text="Explore"
				/>
			</Card>
		</>
	) : (
		<>
			<div id="tutorials-search-results-label" className="g-screen-reader-only">
				Tutorials search results
			</div>
			<CommandBarList ariaLabelledBy="tabs-search-results-label">
				{searchResults.map((hit) => {
					const { _highlightResult, id, products } = hit
					const { name, description } = _highlightResult
					const badges = products?.map(
						(productSlug) => productSlugsToNames[productSlug]
					)
					const [productSlug, collectionSlug] =
						hit.defaultContext.slug.split('/')
					const [, tutorialSlug] = hit.slug.split('/')
					const resultUrl = `/${
						productSlug === 'cloud' ? 'hcp' : productSlug
					}/tutorials/${collectionSlug}/${tutorialSlug}`

					return (
						<CommandBarLinkListItem
							key={id}
							title={name?.value}
							description={description?.value}
							url={resultUrl}
							badges={badges}
						/>
					)
				})}
			</CommandBarList>
		</>
	)
}

export default TutorialsTabContents
