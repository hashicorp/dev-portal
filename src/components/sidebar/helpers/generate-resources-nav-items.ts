import { ProductSlug } from 'types/products'

const DEFAULT_COMMUNITY_FORUM_LINK = 'https://discuss.hashicorp.com/'

const COMMUNITY_FORUM_LINKS_BY_SLUG = {
  vault: 'https://discuss.hashicorp.com/c/vault/30',
  waypoint: 'https://discuss.hashicorp.com/c/waypoint/51',
}

const generateCommunityForumNavItem = (productSlug: ProductSlug) => {
  const title = 'Community Forum'
  const href =
    COMMUNITY_FORUM_LINKS_BY_SLUG[productSlug] || DEFAULT_COMMUNITY_FORUM_LINK
  return { href, title }
}

const generateResourcesNavItems = (productSlug: ProductSlug) => {
  return [
    { heading: 'Resources' },
    { title: 'All Tutorials', href: 'https://learn.hashicorp.com/search' },
    generateCommunityForumNavItem(productSlug),
    {
      title: 'Support',
      href: 'https://www.hashicorp.com/customer-success',
    },
    { title: 'GitHub', href: 'https://github.com/hashicorp/' },
  ]
}

export { generateResourcesNavItems }
