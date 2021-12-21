import getBreadcrumbLinks from './get-breadcrumb-links'
import waypointNavData from './fixtures/waypoint-nav-data.json'

describe('getBreadcrumbLinks', () => {
  it('returns links for a basic example', () => {
    const args = {
      basePath: 'docs',
      pathParts: ['getting-started'],
      navData: waypointNavData,
    }
    const expected = [
      {
        title: 'Getting Started',
        url: '/docs/getting-started',
      },
    ]
    expect(getBreadcrumbLinks(args)).toEqual(expected)
  })

  it('returns links for overview paths using the title of the parent category', () => {
    const args = {
      basePath: 'docs',
      pathParts: ['intro', 'vs'],
      navData: waypointNavData,
    }
    const expected = [
      {
        title: 'Introduction',
        url: '/docs/intro',
      },
      {
        title: 'Waypoint vs. Other Software',
        url: '/docs/intro/vs',
      },
    ]
    expect(getBreadcrumbLinks(args)).toEqual(expected)
  })

  it('skips index-less categories in breadcrumb paths', () => {
    const args = {
      basePath: 'docs',
      pathParts: ['kubernetes', 'install'],
      navData: waypointNavData,
    }
    const expected = [
      {
        title: 'Install',
        url: '/docs/kubernetes/install',
      },
    ]
    expect(getBreadcrumbLinks(args)).toEqual(expected)
  })
})
