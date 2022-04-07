/**
 * These types reflect data shapes returned from client methods
 */

// @TODO consider nominal generic typing here
// https://basarat.gitbook.io/typescript/main-1/nominaltyping
export type uuid = string
export type slug = string
export type identifier = uuid | slug

export interface Tutorial {
  id?: identifier // uuid
  slug: identifier
  name: string
  description: string
  content: string // mdx content
  collectionCtx: CollectionCtxLite
  readTime: number
  edition: EditionOption // defaults to open source
  productsUsed?: ProductUsed[]
  video?: TutorialVideo
  handsOnLab?: TutorialHandsOnLab
  repo?: string
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
    | 'slug'
    | 'description'
    | 'readTime'
    | 'edition'
    | 'productsUsed'
    | 'video'
    | 'handsOnLab'
  > {
  defaultContext: CollectionLite
}

export type CollectionLite = Pick<
  Collection,
  'id' | 'name' | 'shortName' | 'slug' | 'theme' | 'level'
>

export interface Collection {
  id?: uuid // uuid
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
}

export enum EditionOption {
  openSource = 'open_source',
  enterprise = 'enterprise',
  tfcFree = 'tfc:free',
  tfcTeam = 'tfc:team',
  tfcGov = 'tfc:team_governance',
  tfcBiz = 'tfc:business',
  hcp = 'hcp',
}

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

/**
 * TYPE GUARDS ---------------------------------
 */
//  type guard to distinguish products from themes
export function themeIsProduct(
  theme: ThemeOption | ProductOption
): theme is ProductOption {
  return Object.values(ProductOption).includes(theme as ProductOption)
}
