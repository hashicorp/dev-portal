import { getVersionFromPath } from '../get-version-from-path'

describe('getVersionFromPath', () => {
  it('should return the version if it is present', () => {
    {
      const path =
        'https://waypointproject.io/docs/v10.2.x/waypoint-hcl/variables/deploy'

      const version = getVersionFromPath(path)
      expect(version).toEqual('v10.2.x')
    }

    {
      const path =
        'https://waypointproject.io/docs/v9000.9000.x/waypoint-hcl/variables/deploy'

      const version = getVersionFromPath(path)
      expect(version).toEqual('v9000.9000.x')
    }

    {
      const path =
        'https://waypointproject.io/docs/v0.5.x/waypoint-hcl/variables/deploy'

      const version = getVersionFromPath(path)
      expect(version).toEqual('v0.5.x')
    }
  })

  it('should return `undefined` if no version is present', () => {
    const path = 'https://waypointproject.io/docs/waypoint-hcl/variables/deploy'
    const version = getVersionFromPath(path)
    expect(version).toBeUndefined()
  })

  it('should return `undefined` if version is not formatted properly', () => {
    {
      const path =
        'https://waypointproject.io/docs/10.2.4-canary.6/waypoint-hcl/variables/deploy'
      const version = getVersionFromPath(path)
      expect(version).toBeUndefined()
    }

    {
      const path =
        'https://waypointproject.io/docs/v10.2/waypoint-hcl/variables/deploy'
      const version = getVersionFromPath(path)
      expect(version).toBeUndefined()
    }
  })
})
