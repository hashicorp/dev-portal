import detectAndReformatLearnUrl from '../detect-and-reformat-learn-url'

describe('detectAndReformatLearnUrl', () => {
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
      // Note: underlying getCollectionSlug() handles beta products
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
