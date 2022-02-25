import { Product } from 'types/products'
import { ReleaseVersion } from 'lib/fetch-release-data'
import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { MenuItem } from 'components/sidebar'

const PLATFORM_MAP = {
  Mac: 'darwin',
  Win: 'windows',
  Linux: 'linux',
}

export interface SortedReleases {
  [os: string]: {
    [arch: string]: string
  }
}

export const initializeBackToLink = (
  currentProduct: Product
): SidebarSidecarLayoutProps['backToLink'] => {
  return {
    text: `Back to ${currentProduct.name}`,
    url: `/${currentProduct.slug}`,
  }
}

export const initializeBreadcrumbLinks = (
  currentProduct: Product,
  selectedVersion: string
): BreadcrumbLink[] => {
  return [
    {
      title: 'Developer',
      url: '/',
    },
    {
      title: currentProduct.name,
      url: `/${currentProduct.slug}`,
    },
    {
      isCurrentPage: true,
      title: `Install v${selectedVersion}`,
      url: `/${currentProduct.slug}/downloads`,
    },
  ]
}

export const initializeNavData = (currentProduct: Product): MenuItem[] => {
  return [
    ...currentProduct.sidebar.landingPageNavData,
    { divider: true },
    ...currentProduct.sidebar.resourcesNavData,
  ]
}

export const getPageSubtitle = (
  currentProduct: Product,
  selectedVersion: string,
  isLatestVersion: boolean
): string => {
  const versionText = `v${selectedVersion}${
    isLatestVersion ? ' (latest version)' : ''
  }`
  return `Install or update to ${versionText} of ${currentProduct.name} to get started.`
}

export const sortPlatforms = (releaseData: ReleaseVersion): SortedReleases => {
  // first we pull the platforms out of the release data object and format it the way we want
  const platforms = releaseData.builds.reduce((acc, build) => {
    if (!acc[build.os]) acc[build.os] = {}
    acc[build.os][build.arch] = build.url
    return acc
  }, {})

  const platformKeys = Object.keys(platforms)

  // create array of sorted values to base the order on
  const sortedValues = Object.keys(PLATFORM_MAP)
    .map((e) => PLATFORM_MAP[e])
    // join the lists together to make sure
    // all items are accounted for when sorting
    .concat(platformKeys)
    // filter our any duplicates and unneeded items
    .filter((elem, pos, arr) => {
      return arr.indexOf(elem) == pos && platformKeys.indexOf(elem) > -1
    })

  return (
    platformKeys
      // sort items based on PLATFORM_MAP order
      .sort((a, b) => {
        return sortedValues.indexOf(a) - sortedValues.indexOf(b)
      })
      // create new sorted object to return
      .reduce((result, key) => {
        result[key] = platforms[key]
        return result
      }, {})
  )
}

export function prettyOs(os: string): string {
  switch (os) {
    case 'darwin':
      return 'macOS'
    case 'freebsd':
      return 'FreeBSD'
    case 'openbsd':
      return 'OpenBSD'
    case 'netbsd':
      return 'NetBSD'
    case 'archlinux':
      return 'Arch Linux'
    case 'linux':
      return 'Linux'
    case 'windows':
      return 'Windows'
    default:
      return os.charAt(0).toUpperCase() + os.slice(1)
  }
}
