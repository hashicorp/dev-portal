import { getTargetPath } from '../get-target-path'

describe('getTargetPath', () => {
  describe('with a nested path', () => {
    it('should return a target path while on "latest"', () => {
      {
        const input = {
          basePath: 'sentinel/intro',
          asPath: '/sentinel/intro/some/nested/article',
          version: 'v1.10.x',
        }
        const target = getTargetPath(input)
        expect(target).toEqual('/sentinel/intro/v1.10.x/some/nested/article')
      }
    })

    it('should return a target path while on an older version', () => {
      {
        const input = {
          basePath: 'sentinel/intro',
          asPath: '/sentinel/intro/v1.8.x/some/nested/article',
          version: 'v1.10.x',
        }
        const target = getTargetPath(input)
        expect(target).toEqual('/sentinel/intro/v1.10.x/some/nested/article')
      }
    })
  })

  describe('with a non-nested path', () => {
    it('should return a target path while on "latest"', () => {
      {
        const input = {
          basePath: 'sentinel/intro',
          asPath: '/sentinel/intro',
          version: 'v1.10.x',
        }
        const target = getTargetPath(input)
        expect(target).toEqual('/sentinel/intro/v1.10.x')
      }
    })

    it('should return a target path while on an older version', () => {
      {
        const input = {
          basePath: 'sentinel/intro',
          asPath: '/sentinel/intro/v1.8.x',
          version: 'v1.10.x',
        }
        const target = getTargetPath(input)
        expect(target).toEqual('/sentinel/intro/v1.10.x')
      }
    })
  })
})
