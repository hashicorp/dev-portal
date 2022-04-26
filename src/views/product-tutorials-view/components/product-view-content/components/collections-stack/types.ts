import {
  ProductOption,
  ThemeOption,
  Collection as ClientCollection,
} from 'lib/learn-client/types'

interface CollectionStackItem
  extends Pick<
    ClientCollection,
    'id' | 'slug' | 'name' | 'description' | 'icon' | 'tutorials'
  > {
  theme?: ProductOption | ThemeOption
}

export interface CollectionsStackProps {
  /** Heading to show above the collection cards. */
  heading: string
  /** Subheading to show above the collection cards. */
  subheading?: string
  /** A product slug, used for theming */
  product: ProductOption
  featuredCollections?: CollectionStackItem[]
}
