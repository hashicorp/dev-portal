import { getVersionFromPath } from '../get-version-from-path'

describe('getVersionFromPath', () => {
  it('should return the version if it is present', () => {
    {
      const path = 'https://developer.hashicorp.com/vault/docs/v1.8.x/platform'

      const version = getVersionFromPath(path)
      expect(version).toEqual('v1.8.x')
    }

    {
      const path =
        'https://developer.hashicorp.com/waypoint/docs/v0.7.x/getting-started'

      const version = getVersionFromPath(path)
      expect(version).toEqual('v0.7.x')
    }
  })

  it('should return `undefined` if no version is present', () => {
    const path = 'https://developer.hashicorp.com/waypoint/docs/getting-started'
    const version = getVersionFromPath(path)
    expect(version).toBeUndefined()
  })

  it('should return `undefined` if version is not formatted properly', () => {
    const path =
      'https://developer.hashicorp.com/waypoint/docs/0.7.x/getting-started'
    const version = getVersionFromPath(path)
    expect(version).toBeUndefined()
  })
})
