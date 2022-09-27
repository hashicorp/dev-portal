import { Configure, Index } from 'react-instantsearch-hooks-web'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconGuide16 } from '@hashicorp/flight-icons/svg-react/guide-16'
import Card from 'components/card'
import StandaloneLink from 'components/standalone-link'
import Text from 'components/text'
import { CustomHitsContainer, NoResultsMessage } from '../'
import { TutorialsTabContentsProps } from './types'
import s from './tutorials-tab-contents.module.css'

const TutorialsTabContents = ({
	currentProductTag,
	tutorialLibraryCta,
}: TutorialsTabContentsProps) => {
	let filters
	if (currentProductTag) {
		const { id } = currentProductTag
		if (id === 'hcp') {
			filters = 'edition:hcp'
		} else {
			filters = `products:${id}`
		}
	}

	return (
		<Index indexName={__config.dev_dot.algolia.tutorialsIndexName}>
			<Configure filters={filters} />
			<CustomHitsContainer
				type="tutorials"
				noResultsSlot={
					<>
						<NoResultsMessage />
						<Card className={s.cta} elevation="base">
							<IconGuide16 className={s.ctaIcon} />
							<Text
								asElement="span"
								className={s.ctaText}
								size={200}
								weight="medium"
							>
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
				}
			/>
		</Index>
	)
}

export default TutorialsTabContents
