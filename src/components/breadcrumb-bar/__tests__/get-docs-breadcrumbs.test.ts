import getDocsBreadcrumbs from '../utils/get-docs-breadcrumbs'
import waypointNavData from '../__fixtures__/waypoint-nav-data.json'

describe('getDocsBreadcrumbs', () => {
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
        isCurrentPage: true,
      },
    ]
    expect(getDocsBreadcrumbs(args)).toEqual(expected)
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
        isCurrentPage: true,
      },
    ]
    expect(getDocsBreadcrumbs(args)).toEqual(expected)
  })

  it('skips index-less categories in breadcrumb paths', () => {
    const args = {
      basePath: 'docs',
      pathParts: ['kubernetes', 'install'],
      navData: waypointNavData,
    }
    const expected = [
      {
        title: 'Kubernetes',
      },
      {
        title: 'Install',
        url: '/docs/kubernetes/install',
        isCurrentPage: true,
      },
    ]
    expect(getDocsBreadcrumbs(args)).toEqual(expected)
  })
})
