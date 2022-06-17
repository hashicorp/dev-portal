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
 * A dictionary of product slugs to GitHub links.
 */
const GITHUB_LINKS_BY_SLUG: { [K in ProductSlug]: string } = {
  boundary: 'https://github.com/hashicorp/boundary',
  consul: 'https://github.com/hashicorp/consul',
  hcp: 'https://github.com/hashicorp', // No specific repo to link to
  nomad: 'https://github.com/hashicorp/nomad',
  packer: 'https://github.com/hashicorp/packer',
  sentinel: 'https://github.com/hashicorp', // No specific repo to link to
  terraform: 'https://github.com/hashicorp/terraform',
  vagrant: 'https://github.com/hashicorp/vagrant',
  vault: 'https://github.com/hashicorp/vault',
  waypoint: 'https://github.com/hashicorp/waypoint',
}

/**
 * Generates the sidebar nav item for the Community Forum link. If given a
 * Product slug specified in `COMMUNITY_FORUM_LINKS_BY_SLUG`, that Product's
 * link will be used. Otherwise, a general default link is used.
 */
function generateGitHubNavItem(productSlug?: ProductSlug) {
  return {
    title: 'GitHub',
    href: GITHUB_LINKS_BY_SLUG[productSlug] || 'https://github.com/hashicorp',
  }
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
    generateGitHubNavItem(productSlug),
  ]
}

export { generateResourcesNavItems }
