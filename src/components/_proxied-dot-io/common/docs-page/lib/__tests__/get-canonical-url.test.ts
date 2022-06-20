import { getCanonicalUrlForDocsPage } from '../get-canonical-url'

describe('getCanonicalUrlForDocsPage', () => {
  test('generates a canonical URL for a product - waypoint', () => {
    expect(
      getCanonicalUrlForDocsPage({
        baseRoute: 'docs',
        currentPath: 'upgrade/compatibility',
        productSlug: 'waypoint',
      })
    ).toMatchInlineSnapshot(
      `"https://www.waypointproject.io/docs/upgrade/compatibility"`
    )
  })

  test('generates a canonical URL for a product - vault', () => {
    expect(
      getCanonicalUrlForDocsPage({
        baseRoute: 'docs',
        currentPath: 'upgrade/compatibility',
        productSlug: 'vault',
      })
    ).toMatchInlineSnapshot(
      `"https://www.vaultproject.io/docs/upgrade/compatibility"`
    )
  })

  test('does not generate an invalid canonical URL', () => {
    expect(
      getCanonicalUrlForDocsPage({
        baseRoute: 'docs',
        currentPath: 'upgrade/compatibility',
        productSlug: 'fake',
      })
    ).toBeUndefined()
  })
})
