/**
 * NOTE: code currently depends on Reference Docs being the first link
 *
 * :thinking: I wonder if a Context with knowledgeable of the current product being viewed
 * (and updated by ProductSwitcher) would be able to programatically set internal paths
 * in this array?
 *   - example: Reference Docs `path` might be something like `/${currentProductSlug}/docs`
 */
const navigationLinks = [
  {
    id: 'reference-docs',
    label: 'Reference Docs',
    path: '/waypoint/docs',
  },
  {
    href: 'https://www.waypointproject.io/',
    id: 'overview',
    label: 'Overview',
  },
  {
    href: 'https://www.waypointproject.io/commands',
    id: 'cli',
    label: 'CLI',
  },
  {
    href: 'https://www.waypointproject.io/plugins',
    id: 'plugins',
    label: 'Plugins',
  },
  {
    href: 'https://www.waypointproject.io/downloads',
    id: 'downloads',
    label: 'Downloads',
  },
]

export { navigationLinks }
