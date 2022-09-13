import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconGuide16 } from '@hashicorp/flight-icons/svg-react/guide-16'
import Card from 'components/card'
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
		<p>TODO show tutorials results</p>
	)
}

export default TutorialsTabContents
