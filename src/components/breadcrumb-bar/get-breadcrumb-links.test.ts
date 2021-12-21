import getBreadcrumbLinks from './get-breadcrumb-links'
import waypointNavData from './fixtures/waypoint-nav-data.json'

describe('getBreadcrumbLinks', () => {
  it('returns links for a basic example', () => {
    const basePath = 'docs'
    const params = ['intro', 'vs']
    const navData = waypointNavData
    const expected = [
      {
        title: 'Overview',
        url: '/docs/intro',
      },
      {
        title: 'Overview',
        url: '/docs/intro/vs',
      },
    ]
    expect(getBreadcrumbLinks({ basePath, navData, params })).toEqual(expected)
  })
})
