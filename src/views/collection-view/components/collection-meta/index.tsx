import { IconCollections24 } from '@hashicorp/flight-icons/svg-react/collections-24'
import { IconCollections16 } from '@hashicorp/flight-icons/svg-react/collections-16'
import Heading from 'components/heading'
import Text from 'components/text'
import IconTile from 'components/icon-tile'
import s from './collection-meta.module.css'
import ButtonLink from 'components/button-link'

interface CollectionMetaProps {
	heading: {
		text: string
		id: string
	}
	description: string
	numTutorials: number
	cta: {
		href: string
	}
}

export default function CollectionMeta({
	heading,
	description,
	cta,
	numTutorials,
}: CollectionMetaProps) {
	const ctaText = `${numTutorials} ${
		numTutorials > 1 ? `tutorials` : `tutorial`
	}`
	return (
		<>
			<IconTile>
				<IconCollections24 className={s.icon} />
			</IconTile>
			<Heading
				level={1}
				size={500}
				weight="bold"
				id={heading.id}
				className={s.heading}
			>
				{heading.text}
			</Heading>
			<Text className={s.description}>{description}</Text>
			<div className={s.cta}>
				<ButtonLink
					href={cta.href}
					text="Start"
					ariaLabel="Start first tutorial"
				/>
				<span className={s.ctaText}>
					<IconCollections16 className={s.ctaIcon} />
					<Text size={100}>{ctaText}</Text>
				</span>
			</div>
		</>
	)
}
