import { CollectionCardPropsWithId } from 'components/collection-card'

export interface CertificationsSectionProps {
	imageSrc: string
	heading: string
	description: string[]
	collectionCards: CollectionCardPropsWithId[]
	link: {
		url: string
		text: string
	}
}
