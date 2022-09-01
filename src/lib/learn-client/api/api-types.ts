/**
 * These types reflect raw return shapes from the Learn API
 */

import {
	uuid,
	CollectionLevelOption,
	CollectionCategoryOption,
	TutorialProgressPercent,
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

export interface ApiCollectionTutorialProgress extends BaseModel {
	user_id: string
	collection_id: uuid
	tutorial_id: uuid
	complete_percent: TutorialProgressPercent
	/**
	 * Note: so far, we've only needed the tutorial_id from this record type.
	 * Perhaps we could not include detailed tutorial data in the API response?
	 */
	tutorial: ApiTutorialLite
	/**
	 * Note: so far, we've only needed the collection_id from this record type.
	 * Perhaps we could not include detailed collection data in the API response?
	 */
	collection: ApiCollectionLite
}

export interface ApiBookmark extends BaseModel {
	tutorial_id: ApiTutorial['id']
	tutorial: ApiTutorial
	user_id: string
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

export interface ApiPage extends BaseModel {
	slug: string
	/** Note that page_data may later vary depending on the type of page.
	 * For now, we only have product pages, so we only expect ApiProductPageData.
	 * Fetched data is validated using a Joi schema in getPage and getPages. */
	page_data: ApiProductPageData
}

export interface ApiProductPageData {
	blocks: ApiProductViewBlock[]
	show_product_sitemap?: boolean
	docs_cta?: {
		heading: string
		subheading: string
		links: {
			title: string
			url: string
		}[]
	}
}

/** Note that apart from snake_casing rather than camelCasing,
 * ApiProductViewBlock is the same as ProductViewBlock.
 */
export type ApiProductViewBlock =
	| ApiFeaturedStackBlock
	| ApiBrandedCalloutBlock
	| ApiCardListBlock
	| ApiTutorialsStackBlock
	| ApiCollectionsStackBlock

type ApiFeaturedStackBlock = {
	type: 'FeaturedStack'
	heading: string
	subheading?: string
	blocks: (
		| ApiBrandedCalloutBlock
		| ApiCardListBlock
		| ApiTutorialsStackBlock
		| ApiCollectionsStackBlock
	)[]
}

type ApiBrandedCalloutBlock = {
	type: 'BrandedCallout'
	product: ProductOption
	heading: string
	subheading?: string
	cta: {
		text: string
		url: string
	}
}

type ApiLogoCardBlock = {
	type: 'LogoCard'
	logo: string
	/** A single collection identifier string, which will be filled in
	 * using fetched inlineCollections data */
	collection_slug: string
}

type ApiCardListBlock = {
	type: 'CardList'
	items: ApiLogoCardBlock[]
}

type ApiTutorialsStackBlock = {
	type: 'TutorialsStack'
	heading: string
	subheading: string
	/** Tutorial identifier strings, which will be filled in
	 * using fetched inlineCollections data */
	tutorial_slugs: string[]
}

type ApiCollectionsStackBlock = {
	type: 'CollectionsStack'
	heading: string
	subheading: string
	product: ProductOption
	/** Collection identifier strings, which will be filled in
	 * using fetched inlineCollections data */
	collection_slugs: string[]
}
