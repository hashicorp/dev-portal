import nock from 'nock'
import detectAndReformatLearnUrl from '../detect-and-reformat-learn-url'

/**
 * Mocks return value from 'api/tutorials-map' endpoint.
 * Maps tutorial slugs to tutorial URLs which include the default collection.
 * When adding new test cases, make sure the path is accounted for below
 *
 * [key: database tutorial slug]: value — dev dot absolute path
 */
const MOCK_TUTORIALS_MAP = {
  'waypoint/aws-ecs': '/waypoint/tutorials/deploy-aws/aws-ecs',
  'vault/getting-started-install':
    '/vault/tutorials/getting-started/getting-started-install',
}

describe('detectAndReformatLearnUrl', () => {
  beforeEach(async () => {
    // the api base url defaults to localhost when no VERCEL_URL is provided
    const scope = nock('http://localhost:3000/api/tutorials-map')
      .persist()
      .get(/.*/)
      .reply(200, MOCK_TUTORIALS_MAP)
  })

  it('returns non-Learn URLs back unmodified', async () => {
    const nonLearnUrls: string[] = [
      '/vault/docs',
      '/vault',
      '/vault/tutorials',
      '/waypoint/tutorials',
    ]
    for (let n = 0; n < nonLearnUrls.length; n++) {
      const url = nonLearnUrls[n]
      const result = await detectAndReformatLearnUrl(url)
      expect(result).toBe(url)
    }
  })

  it('reformats collection URLs', async () => {
    interface UrlTestCase {
      input: string
      expected: string
    }
    const collectionUrls: UrlTestCase[] = [
      {
        input: '/collections/vault/getting-started',
        expected: '/vault/tutorials/getting-started',
      },
      {
        input: '/collections/waypoint/deploy-aws',
        expected: '/waypoint/tutorials/deploy-aws',
      },
      // Note: underlying rewriteTutorialsLink() handles beta products
      {
        input: '/collections/consul/kubernetes',
        expected: 'https://learn.hashicorp.com/collections/consul/kubernetes',
      },
    ]
    for (let n = 0; n < collectionUrls.length; n++) {
      const { input, expected } = collectionUrls[n]
      const result = await detectAndReformatLearnUrl(input)
      expect(result).toBe(expected)
    }
  })

  it('reformats tutorial URLs', async () => {
    interface UrlTestCase {
      input: string
      expected: string
    }
    const tutorialUrls: UrlTestCase[] = [
      {
        input: '/tutorials/vault/getting-started-install',
        expected: '/vault/tutorials/getting-started/getting-started-install',
      },
      {
        input:
          '/tutorials/vault/getting-started-install?in=vault/getting-started',
        expected: '/vault/tutorials/getting-started/getting-started-install',
      },
      {
        input:
          '/tutorials/vault/getting-started-install?in=vault/getting-started-ui',
        expected: '/vault/tutorials/getting-started-ui/getting-started-install',
      },
      {
        input: '/tutorials/waypoint/aws-ecs?in=waypoint/deploy-aws',
        expected: '/waypoint/tutorials/deploy-aws/aws-ecs',
      },
      {
        input: '/tutorials/waypoint/aws-ecs',
        expected: '/waypoint/tutorials/deploy-aws/aws-ecs',
      },
    ]
    for (let n = 0; n < tutorialUrls.length; n++) {
      const { input, expected } = tutorialUrls[n]
      const result = await detectAndReformatLearnUrl(input)
      expect(result).toBe(expected)
    }
  })
})
