import { Product } from 'types/products'
import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { MenuItem } from 'components/sidebar'

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
      url: `/${currentProduct.slug}/downloads/${currentProduct.slug}`,
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
