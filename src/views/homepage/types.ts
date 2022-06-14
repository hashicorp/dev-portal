import {
  FeaturedLearnCard,
  FeaturedLearnContent,
} from 'views/product-downloads-view/types'

interface HomePageContentProps {
  featuredLearnCards: FeaturedLearnCard[]
}

interface HomePageViewProps {
  featuredLearnCards: HomePageContentProps['featuredLearnCards']
}

interface GenerateStaticPropsOptions {
  featuredLearnContent: FeaturedLearnContent[]
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
