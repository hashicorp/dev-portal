import { ProductSlug } from 'types/products'

const DEFAULT_COMMUNITY_FORUM_LINK = 'https://discuss.hashicorp.com/'

const COMMUNITY_FORUM_LINKS_BY_SLUG = {
  vault: 'https://discuss.hashicorp.com/c/vault/30',
  waypoint: 'https://discuss.hashicorp.com/c/waypoint/51',
}

/**
 * Generates the sidebar nav item for the Community Forum link. If given a
 * Product slug specified in `COMMUNITY_FORUM_LINKS_BY_SLUG`, that Product's
 * link will be used. Otherwise, a general default link is used.
 */
const generateCommunityForumNavItem = (productSlug?: ProductSlug) => {
  const title = 'Community Forum'
  const href =
    COMMUNITY_FORUM_LINKS_BY_SLUG[productSlug] || DEFAULT_COMMUNITY_FORUM_LINK
  return { href, title }
}

/**
 * Generates the sidebar nav items for the Resources section of the sidebar.
 * Optionally accepts a Product slug for customization of links. Invokes
 * additional helper functions for each nav item as needed.
 */
const generateResourcesNavItems = (productSlug?: ProductSlug) => {
  return [
    { heading: 'Resources' },
    { title: 'All Tutorials', href: 'https://learn.hashicorp.com/' },
    generateCommunityForumNavItem(productSlug),
    {
      title: 'Support',
      href: 'https://www.hashicorp.com/customer-success',
    },
    { title: 'GitHub', href: 'https://github.com/hashicorp/' },
  ]
}

export { generateResourcesNavItems }
