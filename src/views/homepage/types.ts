import { CollectionCardPropsWithId } from 'components/collection-card'
import { HomePageAuthoredContent } from './contentSchema'

interface HomePageContentProps {
  hero: $TSFixMe
  navNotice: string
  learnSection: {
    collectionCards: CollectionCardPropsWithId[]
  } & $TSFixMe
  merchandising: $TSFixMe
  preFooter: $TSFixMe
}

interface HomePageProps {
  content: HomePageContentProps
}

export type { HomePageAuthoredContent, HomePageContentProps, HomePageProps }
