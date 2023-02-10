import {
	CardTitleProps,
	CardDescriptionProps,
} from 'components/card/components'
import { SectionProps } from '../section'

interface CardGridBlockCard {
	title: CardTitleProps['text']
	description: CardDescriptionProps['text']
	url: string
}

interface CardGridBlockProps
	extends Pick<SectionProps, 'heading' | 'subheading'> {
	cards: CardGridBlockCard[]
}

export type { CardGridBlockCard, CardGridBlockProps }
