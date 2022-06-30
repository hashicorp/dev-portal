import { isInvalidURI } from '../is-invalid-uri'

describe('isInvalidURI', () => {
  it.each([
    ['/docs/upgrade', false],
    ['foo/bar%23anchor', false],
    [
      "/docs/upgrade%25'%20AND%202*3*8=6*8%20AND%20'zVVl'!='zVVl%25/upgrade-specific",
      true,
    ],
  ])('given `%s`, returns `%s`', (a, expected) => {
    expect(isInvalidURI(a)).toBe(expected)
  })
})
