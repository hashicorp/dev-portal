import semverRSort from 'semver/functions/rsort'
import { ProductData } from 'types/products'
import { ReleasesAPIResponse, ReleaseVersion } from 'lib/fetch-release-data'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { MenuItem, SidebarProps } from 'components/sidebar'
import { VersionContextSwitcherProps } from 'components/version-context-switcher'
import { PackageManager, SortedReleases } from './types'

const PLATFORM_MAP = {
  Mac: 'darwin',
  Win: 'windows',
  Linux: 'linux',
}

// exclude pre-releases and such
const VALID_SEMVER_REGEX = /^\d+\.\d+\.\d+$/

export const generateDefaultPackageManagers = (
  product: Pick<ProductData, 'slug'>
): PackageManager[] => {
  const productSlug = product.slug

  return [
    {
      label: 'Homebrew',
      commands: [
        `brew tap hashicorp/tap`,
        `brew install hashicorp/tap/${productSlug}`,
      ],
      os: 'darwin',
    },
    {
      label: 'Ubuntu/Debian',
      commands: [
        `curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -`,
        `sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"`,
        `sudo apt-get update && sudo apt-get install ${productSlug}`,
      ],
      os: 'linux',
    },
    {
      label: 'CentOS/RHEL',
      commands: [
        `sudo yum install -y yum-utils`,
        `sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo`,
        `sudo yum -y install ${productSlug}`,
      ],
      os: 'linux',
    },
    {
      label: 'Fedora',
      commands: [
        `sudo dnf install -y dnf-plugins-core`,
        `sudo dnf config-manager --add-repo https://rpm.releases.hashicorp.com/fedora/hashicorp.repo`,
        `sudo dnf -y install ${productSlug}`,
      ],
      os: 'linux',
    },
    {
      label: 'Amazon Linux',
      commands: [
        `sudo yum install -y yum-utils`,
        `sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo`,
        `sudo yum -y install ${productSlug}`,
      ],
      os: 'linux',
    },
    {
      label: 'Homebrew',
      commands: [
        `brew tap hashicorp/tap`,
        `brew install hashicorp/tap/${productSlug}`,
      ],
      os: 'linux',
    },
  ]
}

export const generatePackageManagers = ({
  defaultPackageManagers,
  packageManagerOverrides,
}: {
  defaultPackageManagers: PackageManager[]
  packageManagerOverrides: PackageManager[]
}): PackageManager[] => {
  let packageManagers: PackageManager[]

  if (packageManagerOverrides) {
    packageManagers = defaultPackageManagers.map((defaultPackageManager) => {
      const override = packageManagerOverrides.find(
        ({ os, label }) =>
          os === defaultPackageManager.os &&
          label === defaultPackageManager.label
      )
      return override || defaultPackageManager
    })
  } else {
    packageManagers = defaultPackageManagers
  }

  return packageManagers
}

export const getPageSubtitle = ({
  productName,
  version,
  isLatestVersion,
}: {
  productName: ProductData['name']
  version: string
  isLatestVersion: boolean
}): string => {
  const versionText = `v${version}${isLatestVersion ? ' (latest version)' : ''}`
  return `Install or update to ${versionText} of ${productName} to get started.`
}

export const initializeBackToLink = (
  currentProduct: Pick<ProductData, 'name' | 'slug'>
): SidebarProps['backToLinkProps'] => {
  return {
    text: `Back to ${currentProduct.name}`,
    href: `/${currentProduct.slug}`,
  }
}

export const initializeBreadcrumbLinks = (
  currentProduct: Pick<ProductData, 'name' | 'slug'>,
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

export const initializeNavData = (
  currentProduct: Pick<ProductData, 'sidebar'>
): MenuItem[] => {
  return [
    ...currentProduct.sidebar.landingPageNavData,
    { divider: true },
    ...currentProduct.sidebar.resourcesNavData,
  ]
}

export const initializeVersionSwitcherOptions = ({
  latestVersion,
  releases,
}: {
  latestVersion: ReleaseVersion['version']
  releases: ReleasesAPIResponse
}): VersionContextSwitcherProps['options'] => {
  return semverRSort(
    Object.keys(releases.versions).filter((version) => {
      const isValidRegex = !!version.match(VALID_SEMVER_REGEX)
      return isValidRegex
    })
  ).map((version) => {
    const isLatest = version === latestVersion
    return {
      label: `${version}${isLatest ? ' (latest)' : ''}`,
      value: version,
    }
  })
}

export const sortPlatforms = (releaseData: ReleaseVersion): SortedReleases => {
  // first we pull the platforms out of the release data object and format it the way we want
  const platforms = releaseData.builds.reduce((acc, build) => {
    if (!acc[build.os]) {
      acc[build.os] = {}
    }
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
