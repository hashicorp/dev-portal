/**
 * These types reflect raw return shapes from the Learn API
 */

import {
  uuid,
  CollectionLevelOption,
  CollectionCategoryOption,
  ThemeOption,
  EditionOption,
  HandsOnLabProviderOption,
  ProductOption,
  VideoHostOption,
} from '../types'

interface BaseModel {
  id: string
  created_at: string | null
  updated_at: string | null
}

interface ContentBaseModel extends BaseModel {
  slug: string
  name: string
  description: string
}

interface DefaultCollection {
  default_collection: ApiCollectionLite
}

interface ApiDefaultCollection extends ApiCollectionLite {
  tutorial_id: string
}

type ApiFeaturedCollection = ApiDefaultCollection

export interface ApiTutorial extends ContentBaseModel, DefaultCollection {
  content: string
  default_collection_id: uuid
  featured_collections: ApiFeaturedCollection[]
  read_time: number
  edition: EditionOption | null
  video_id: string | null
  video_host: VideoHostOption | null
  video_inline: boolean | null
  hands_on_lab_id: string | null
  hands_on_lab_provider: HandsOnLabProviderOption | null
  products_used: ApiProductsUsed[] // Returns empty array if no products used
}

// Everything in base ApiTutorial, except content
// used as reference in Collection Tutorials
export type ApiTutorialLite = Omit<ApiTutorial, 'content'>

export interface ApiCollectionLite extends ContentBaseModel {
  short_name: string
  icon: string
  theme: ProductOption | ThemeOption
  ordered: boolean
  level: CollectionLevelOption
  category: CollectionCategoryOption
}

// Collection interface that is enriched with tutorials
export interface ApiCollection extends ApiCollectionLite {
  tutorials: ApiCollectionTutorial[]
}

export interface ApiCollectionTutorial
  extends Pick<BaseModel, 'id' | 'created_at' | 'updated_at'> {
  collection_id: string
  tutorial_id: string
  display_order: number
  tutorial: ApiTutorial
}

export interface ApiProduct extends Omit<ContentBaseModel, 'slug'> {
  slug: ProductOption
  docs_url: string
}

export interface ApiProductsUsed extends BaseModel {
  tutorial_id: uuid
  product_id: uuid
  is_primary: boolean
  is_beta: boolean
  min_version: string | null
  max_version: string | null
  product: ApiProduct
}
