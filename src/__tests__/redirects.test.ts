import {
  splitRedirectsByType,
  groupSimpleRedirects,
} from '../../config/redirects'

describe('splitRedirectsByType', () => {
  test('splits simple and glob redirects', () => {
    const { simpleRedirects, globRedirects } = splitRedirectsByType([
      {
        source: '/:path',
        destination: '/',
      },
      {
        source: '/path',
        destination: '',
      },
    ])
    expect(simpleRedirects).toStrictEqual([
      {
        source: '/path',
        destination: '',
      },
    ])
    expect(globRedirects).toStrictEqual([
      {
        source: '/:path',
        destination: '/',
      },
    ])
  })
})

describe('groupSimpleRedirects', () => {
  test('groups simple redirects by product', () => {
    const groupedSimpleRedirects = groupSimpleRedirects([
      {
        source: '/source',
        destination: '/destination',
        permanent: false,
        has: [
          {
            type: 'host',
            value: '(www\\.boundaryproject\\.io|test-bd\\.hashi-mktg\\.com)',
          },
        ],
      },
      {
        source: '/another-source',
        destination: '/another-destination',
        permanent: true,
        has: [
          {
            type: 'host',
            value: '(www\\.boundaryproject\\.io|test-bd\\.hashi-mktg\\.com)',
          },
        ],
      },
      {
        source: '/source',
        destination: '/destination',
        permanent: false,
        has: [
          {
            type: 'host',
            value: '(www\\.consul\\.io|test-cs\\.hashi-mktg\\.com)',
          },
        ],
      },
      {
        source: '/another-source',
        destination: '/another-destination',
        permanent: true,
        has: [
          {
            type: 'host',
            value: '(www\\.consul\\.io|test-cs\\.hashi-mktg\\.com)',
          },
        ],
      },
    ])

    expect(groupedSimpleRedirects).toStrictEqual({
      boundary: {
        '/source': {
          destination: '/destination',
          permanent: false,
        },
        '/another-source': {
          destination: '/another-destination',
          permanent: true,
        },
      },
      consul: {
        '/source': {
          destination: '/destination',
          permanent: false,
        },
        '/another-source': {
          destination: '/another-destination',
          permanent: true,
        },
      },
    })
  })
})

export {}
