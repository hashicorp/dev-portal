import { renderHook } from '@testing-library/react-hooks'
import useCurrentPath from '../use-current-path'

describe('useCurrentPath', () => {
  const testPath = '/test-path'
  const testHash = '#test'
  const testSearch = '?foo=bar'

  let useRouter: jest.SpyInstance
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    useRouter = jest.spyOn(require('next/router'), 'useRouter')
  })

  afterAll(() => {
    useRouter.mockRestore()
  })

  describe('when hash and search are not in the URL', () => {
    beforeAll(() => {
      useRouter.mockReturnValue({ asPath: testPath })
    })

    test.each([
      { excludeHash: false, excludeSearch: false },
      { excludeHash: true, excludeSearch: false },
      { excludeHash: false, excludeSearch: true },
      { excludeHash: true, excludeSearch: true },
    ])(
      '.useCurrentPath({ excludeHash: $excludeHash, excludeSearch: $excludeSearch })',
      ({ excludeHash, excludeSearch }) => {
        const { result } = renderHook(() =>
          useCurrentPath({ excludeHash, excludeSearch })
        )
        expect(result.current).toEqual(testPath)
      }
    )
  })

  describe('when hash is present and search is not present in the URL', () => {
    beforeAll(() => {
      useRouter.mockReturnValue({
        asPath: `${testPath}${testHash}`,
      })
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
        const { result } = renderHook(() =>
          useCurrentPath({ excludeHash, excludeSearch })
        )
        expect(result.current).toEqual(expectedPath)
      }
    )
  })

  describe('when hash is not present and search is present in the URL', () => {
    beforeAll(() => {
      useRouter.mockReturnValue({
        asPath: `${testPath}${testSearch}`,
      })
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
        const { result } = renderHook(() =>
          useCurrentPath({ excludeHash, excludeSearch })
        )
        expect(result.current).toEqual(expectedPath)
      }
    )
  })

  describe('when both hash and search are present in the URL', () => {
    beforeAll(() => {
      useRouter.mockReturnValue({
        asPath: `${testPath}${testSearch}${testHash}`,
      })
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
        const { result } = renderHook(() =>
          useCurrentPath({ excludeHash, excludeSearch })
        )
        expect(result.current).toEqual(expectedPath)
      }
    )
  })
})
