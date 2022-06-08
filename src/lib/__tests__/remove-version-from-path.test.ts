import { removeVersionFromPath } from '../remove-version-from-path'

describe('removeVersionFromPath', () => {
  it('should return a cleaned path', () => {
    {
      const path =
        'https://waypointproject.io/docs/v10.2.x/waypoint-hcl/variables/deploy'

      const cleanedPath = removeVersionFromPath(path)
      expect(cleanedPath).toEqual(
        'https://waypointproject.io/docs/waypoint-hcl/variables/deploy'
      )
    }

    {
      const path = '/v9.0.1/'

      const cleanedPath = removeVersionFromPath(path)
      expect(cleanedPath).toEqual('/')
    }

    {
      const path =
        'https://waypointproject.io/docs/v0.5.x/waypoint-hcl/variables/deploy'

      const cleanedPath = removeVersionFromPath(path)
      expect(cleanedPath).toEqual(
        'https://waypointproject.io/docs/waypoint-hcl/variables/deploy'
      )
    }
  })

  it('should return the original path if no version is present', () => {
    const path = 'https://waypointproject.io/docs/waypoint-hcl/variables/deploy'

    const cleanedPath = removeVersionFromPath(path)
    expect(cleanedPath).toEqual(
      'https://waypointproject.io/docs/waypoint-hcl/variables/deploy'
    )
  })
})
