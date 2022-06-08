import { removeVersionFromPath } from '../remove-version-from-path'

describe('removeVersionFromPath', () => {
  it('should return a cleaned path', () => {
    const path = 'https://developer.hashicorp.com/vault/docs/v1.8.x/platform'

    const cleanedPath = removeVersionFromPath(path)
    expect(cleanedPath).toEqual(
      'https://developer.hashicorp.com/vault/docs/platform'
    )
  })

  it('should return the original path if no version is present', () => {
    const path = 'https://developer.hashicorp.com/vault/docs/platform'

    const cleanedPath = removeVersionFromPath(path)
    expect(cleanedPath).toEqual(
      'https://developer.hashicorp.com/vault/docs/platform'
    )
  })
})
