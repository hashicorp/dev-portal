import {
	TutorialCardsGridList,
	TutorialCardsGridListProps,
} from 'components/cards-grid-list'
import { Section, SectionProps } from '../section'

type TutorialCardGridBlockProps = Pick<
	TutorialCardsGridListProps,
	'tutorials'
> &
	Pick<SectionProps, 'heading' | 'subheading'>

const TutorialCardGridBlock = ({
	heading,
	subheading,
	tutorials,
}: TutorialCardGridBlockProps) => {
	return (
		<Section heading={heading} subheading={subheading}>
			<TutorialCardsGridList tutorials={tutorials} />
		</Section>
	)
}

export type { TutorialCardGridBlockProps }
export { TutorialCardGridBlock }
