/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	ApiCollection,
	ApiTutorial,
	ApiTutorialVariant,
	ApiTutorialVariantOption,
} from './api/api-types'

/**
 * These types reflect data shapes returned from client methods
 */

// @TODO consider nominal generic typing here
// https://basarat.gitbook.io/typescript/main-1/nominaltyping
export type uuid = string
export type slug = string
export type identifier = uuid | slug

export interface TutorialIdCollectionId {
	tutorialId: ApiTutorial['id']
	collectionId: ApiCollection['id']
}

export interface Tutorial {
	id?: ApiTutorial['id'] // uuid
	slug: identifier
	name: string
	shortName: string
	description: string
	content: string // mdx content
	collectionCtx: CollectionCtxLite
	readTime: number
	edition: EditionOption // defaults to open source
	productsUsed?: ProductUsed[]
	video?: TutorialVideo
	handsOnLab?: TutorialHandsOnLab
	repo?: string
	variant?: TutorialVariant
}

export interface CollectionCtxLite {
	default: CollectionLite
	featuredIn?: CollectionLite[]
}

export interface CollectionCtxFull {
	default: CollectionLite
	featuredIn?: Collection[]
}

export interface TutorialFullCollectionCtx
	extends Omit<Tutorial, 'collectionCtx'> {
	collectionCtx: CollectionCtxFull
}

export type TutorialVideo = {
	id: string
	videoHost: VideoHostOption
	videoInline?: boolean
}

export type TutorialHandsOnLab = {
	id: string
	provider: HandsOnLabProviderOption
}

// A _lite_ version of tutorial, with all the content for rendering cards, sidebar items etc.
export interface TutorialLite
	extends Pick<
		Tutorial,
		| 'id'
		| 'name'
		| 'shortName'
		| 'slug'
		| 'description'
		| 'readTime'
		| 'edition'
		| 'productsUsed'
		| 'video'
		| 'handsOnLab'
		| 'variant'
	> {
	defaultContext: CollectionLite
}

export type CollectionLite = Pick<
	Collection,
	'id' | 'name' | 'shortName' | 'slug' | 'theme' | 'level'
>

export interface Collection {
	id: uuid // uuid
	slug: slug
	name: string
	shortName: string
	description: string
	icon: string // TODO define this in further detail
	theme: ProductOption | ThemeOption
	level: CollectionLevelOption
	ordered: boolean
	tutorials: TutorialLite[]
	category?: CollectionCategoryOption
	nextCollection?: CollectionLite
}

export interface Product {
	id?: uuid
	slug: ProductOption
	name: string
	docsUrl: string
	description?: string
}

export interface ProductUsed {
	product: Product
	tutorial: identifier
	isBeta: boolean
	isPrimary: boolean
	minVersion?: string
	maxVersion?: string
}

export interface TutorialVariantOption
	extends Omit<ApiTutorialVariantOption, 'display_order'> {
	displayOrder: number
}

export interface TutorialVariant extends Omit<ApiTutorialVariant, 'options'> {
	options: TutorialVariantOption[]
}

export interface getAllTutorialsOptions {
	limit?: number
	fullContent?: boolean
	slugsOnly?: boolean
}

export interface getAllCollectionsOptions
	extends Pick<getAllTutorialsOptions, 'limit'> {
	product?: AllCollectionsProductOptions
}

export type AllCollectionsProductOptions = {
	slug: ProductOption | ThemeOption // If theme option, empty array is returned
	sidebarSort?: boolean
}

/**
 * PRODUCT LANDING PAGES -------------------------------
 */

export interface ProductPageBlockBrandedCallout {
	type: 'BrandedCallout'
	heading: string
	subheading?: string
	cta: {
		text: string
		url: string
	}
	product: ProductOption
}

export interface ProductPageBlockLogoCard {
	type: 'LogoCard'
	logo: CompanyLogoOption
	collectionSlug: string
}

export interface ProductPageBlockCardList {
	type: 'CardList'
	items: ProductPageBlockLogoCard[]
}

export interface ProductPageBlockTutorialsStack {
	type: 'TutorialsStack'
	product: ProductOption
	heading?: string
	subheading?: string
	tutorialSlugs: string[]
}

export interface ProductPageBlockCollectionsStack {
	type: 'CollectionsStack'
	product: ProductOption
	heading?: string
	subheading?: string
	collectionSlugs: string[]
}

export interface ProductPageBlockFeaturedStack {
	type: 'FeaturedStack'
	heading: string
	subheading?: string
	blocks: ProductPageBlockCardList[]
}

export type ProductPageBlock =
	| ProductPageBlockFeaturedStack
	| ProductPageBlockBrandedCallout
	| ProductPageBlockCardList
	| ProductPageBlockTutorialsStack
	| ProductPageBlockCollectionsStack

export interface ProductPage {
	slug: string
	pageData: {
		blocks: ProductPageBlock[]
		showProductSitemap?: boolean
	}
}

/**
 * MISC ENUMS -------------------------------
 */

export enum ProductOption {
	boundary = 'boundary',
	consul = 'consul',
	nomad = 'nomad',
	packer = 'packer',
	terraform = 'terraform',
	vagrant = 'vagrant',
	vault = 'vault',
	waypoint = 'waypoint',
	sentinel = 'sentinel',
}

export enum SectionOption {
	'well-architected-framework' = 'well-architected-framework',
	'validated-patterns' = 'validated-patterns',
}

export enum EditionOption {
	openSource = 'open_source',
	enterprise = 'enterprise',
	hcp = 'hcp',
	tfcFree = 'tfc:free',
	tfcStandard = 'tfc:standard',
	tfcPlus = 'tfc:plus',
}

export type BadgeOption =
	| Exclude<EditionOption, EditionOption.openSource> //  "openSource" is default (no badge)
	| 'beta'

export enum ThemeOption {
	cloud = 'cloud',
	hashicorp = 'hashicorp',
}

export enum CollectionCategoryOption {
	get_started = 'Get Started',
	fundamentals = 'Fundamentals',
	use_cases = 'Use Cases',
	certification = 'Certification Prep',
	production = 'Production',
	integrations = 'Integrations',
	kubernetes = 'Kubernetes',
	operations = 'Operations',
	sandbox = 'Sandbox',
}

export type CollectionLevelOption =
	| 'advanced'
	| 'beginner'
	| 'get_started'
	| 'intermediate'

export enum VideoHostOption {
	youtube = 'youtube',
	wistia = 'wistia',
}

// @TODO delete katacoda option once all removed
export enum HandsOnLabProviderOption {
	katacoda = 'katacoda',
	instruqt = 'instruqt',
}

export enum CompanyLogoOption {
	docker = 'docker',
	github = 'github',
	'microsoft-azure' = 'microsoft-azure',
	oci = 'oci',
	'google-cloud' = 'google-cloud',
	'terraform-cloud' = 'terraform-cloud',
	aws = 'aws',
}

export enum TutorialProgressStatus {
	visited = 'visited',
	in_progress = 'in_progress',
	complete = 'complete',
}

export enum TutorialProgressPercent {
	Zero = '0',
	TwentyFive = '25',
	Fifty = '50',
	SeventyFive = '75',
	Ninety = '90',
	OneHundred = '100',
}

/**
 * TYPE GUARDS ---------------------------------
 */
//  type guard to distinguish products from themes
export function themeIsProduct(
	theme: ThemeOption | ProductOption
): theme is ProductOption {
	return isProductOption(theme)
}
/**
 * Type guard to determine if a string is a ThemeOption or ProductOption
 */
export function isThemeOrProduct(
	string: string
): string is ProductOption | ThemeOption {
	return isThemeOption(string) || isProductOption(string)
}
/**
 * Type guard to determine if a string is a ThemeOption
 */
function isThemeOption(string: string): string is ThemeOption {
	return Object.values(ThemeOption).includes(string as ThemeOption)
}
/**
 * Type guard to determine if a string is a SectionOption
 */
export function isSectionOption(string: string): string is SectionOption {
	return Object.values(SectionOption).includes(string as SectionOption)
}
/**
 * Type guard to determine if a string is a ProductOption
 */
export function isProductOption(string: string): string is ProductOption {
	return Object.values(ProductOption).includes(string as ProductOption)
}
