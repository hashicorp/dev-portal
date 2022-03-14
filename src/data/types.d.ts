export type ProductSlug =
  | 'boundary'
  | 'consul'
  | 'nomad'
  | 'sentinel'
  | 'terraform'
  | 'vagrant'
  | 'vault'
  | 'waypoint'

export interface ProductData {
  name: string
  slug: ProductSlug
  algoliaConfig: AlgoliaConfig
  analyticsConfig?: AnalyticsConfig
  metadata: Metadata
  alertBannerActive: boolean
  alertBanner: AlertBanner
  subnavItems: (SubnavItemClass | 'divider')[]
  version?: string
  vmwareUtilityVersion?: string
  changelogUrl?: string
  packageManagers?: PackageManager[]
  datoToken?: string
}

export interface AlertBanner {
  tag: string
  url: string
  text: string
  linkText: string
  expirationDate: Date
}

export interface AlgoliaConfig {
  indexName: string
  searchOnlyApiKey: string
}

export interface AnalyticsConfig {
  includedDomains: string
  segmentWriteKey: string
}

export interface Metadata {
  title: string
  description: string
  image: string
  icon: Icon[]
}

export interface Icon {
  href: string
}

export interface PackageManager {
  label: string
  commands: string[]
  os: string
}

export interface SubnavItemClass {
  text: string
  url?: string
  type?: 'inbound' | 'outbound'
  submenu?: Submenu[]
}

export interface Submenu {
  text: string
  url: string
}
