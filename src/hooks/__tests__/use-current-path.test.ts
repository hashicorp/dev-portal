import useCurrentPath from '../use-current-path'

describe('useCurrentPath', () => {
  const savedLocation = window.location
  const testPath = '/test-path'
  const testOrigin = 'http://www.test.com'
  const testHash = '#test'
  const testSearch = '?foo=bar'

  beforeAll(() => {
    delete window.location
  })

  afterAll(() => {
    window.location = savedLocation
  })

  describe('when hash and search are not in the URL', () => {
    beforeAll(() => {
      window.location = Object.assign(new URL(`${testOrigin}${testPath}`))
    })

    test.each([
      { excludeHash: false, excludeSearch: false },
      { excludeHash: true, excludeSearch: false },
      { excludeHash: false, excludeSearch: true },
      { excludeHash: true, excludeSearch: true },
    ])(
      '.useCurrentPath({ excludeHash: $excludeHash, excludeSearch: $excludeSearch })',
      ({ excludeHash, excludeSearch }) => {
        expect(useCurrentPath({ excludeHash, excludeSearch })).toEqual(testPath)
      }
    )
  })

  describe('when hash is present and search is not present in the URL', () => {
    beforeAll(() => {
      window.location = Object.assign(
        new URL(`${testOrigin}${testPath}${testHash}`)
      )
    })

    test.each([
      {
        excludeHash: false,
        excludeSearch: false,
        expectedPath: testPath + testHash,
      },
      { excludeHash: true, excludeSearch: false, expectedPath: testPath },
      {
        excludeHash: false,
        excludeSearch: true,
        expectedPath: testPath + testHash,
      },
      { excludeHash: true, excludeSearch: true, expectedPath: testPath },
    ])(
      '.useCurrentPath({ excludeHash: $excludeHash, excludeSearch: $excludeSearch })',
      ({ excludeHash, excludeSearch, expectedPath }) => {
        expect(useCurrentPath({ excludeHash, excludeSearch })).toEqual(
          expectedPath
        )
      }
    )
  })

  describe('when hash is not present and search is present in the URL', () => {
    beforeAll(() => {
      window.location = Object.assign(
        new URL(`${testOrigin}${testPath}${testSearch}`)
      )
    })

    test.each([
      {
        excludeHash: false,
        excludeSearch: false,
        expectedPath: testPath + testSearch,
      },
      {
        excludeHash: true,
        excludeSearch: false,
        expectedPath: testPath + testSearch,
      },
      {
        excludeHash: false,
        excludeSearch: true,
        expectedPath: testPath,
      },
      { excludeHash: true, excludeSearch: true, expectedPath: testPath },
    ])(
      '.useCurrentPath({ excludeHash: $excludeHash, excludeSearch: $excludeSearch })',
      ({ excludeHash, excludeSearch, expectedPath }) => {
        expect(useCurrentPath({ excludeHash, excludeSearch })).toEqual(
          expectedPath
        )
      }
    )
  })

  describe('when both hash and search are present in the URL', () => {
    beforeAll(() => {
      window.location = Object.assign(
        new URL(`${testOrigin}${testPath}${testSearch}${testHash}`)
      )
    })

    test.each([
      {
        excludeHash: false,
        excludeSearch: false,
        expectedPath: testPath + testSearch + testHash,
      },
      {
        excludeHash: true,
        excludeSearch: false,
        expectedPath: testPath + testSearch,
      },
      {
        excludeHash: false,
        excludeSearch: true,
        expectedPath: testPath + testHash,
      },
      { excludeHash: true, excludeSearch: true, expectedPath: testPath },
    ])(
      '.useCurrentPath({ excludeHash: $excludeHash, excludeSearch: $excludeSearch })',
      ({ excludeHash, excludeSearch, expectedPath }) => {
        expect(useCurrentPath({ excludeHash, excludeSearch })).toEqual(
          expectedPath
        )
      }
    )
  })
})
