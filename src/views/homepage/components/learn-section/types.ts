import { CollectionCardPropsWithId } from 'components/collection-card'

export interface LearnSectionProps {
  imageSrc: string
  heading: string
  description: string[]
  collectionCards: CollectionCardPropsWithId[]
  link: {
    url: string
    text: string
  }
}
