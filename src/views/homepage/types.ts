import { CollectionCardPropsWithId } from 'components/collection-card'

interface HomePageContentProps {
  collectionCards: CollectionCardPropsWithId[]
}

interface HomePageViewProps {
  collectionCards: HomePageContentProps['collectionCards']
}

interface GenerateStaticPropsOptions {
  collectionSlugs: string[]
}

interface GenerateStaticPropsOptionsResult {
  props: HomePageViewProps
}

export type {
  GenerateStaticPropsOptions,
  GenerateStaticPropsOptionsResult,
  HomePageContentProps,
  HomePageViewProps,
}
