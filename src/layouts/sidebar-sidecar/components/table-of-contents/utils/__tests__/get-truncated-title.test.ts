import getTruncatedTitle from '../get-truncated-title'

describe('getTruncatedTitle', () => {
  it('leaves a short title unmodified', () => {
    const title = 'Hello world'
    expect(getTruncatedTitle(title)).toBe(title)
  })

  it('does not add ... to a title of exact limit length', () => {
    const title = 'contrib Tools and Helpers'
    const expected = 'contrib Tools and Helpers'
    expect(getTruncatedTitle(title)).toBe(expected)
  })

  it('handles titles that end in long words', () => {
    const title = 'Set up automated infrastructure'
    const expected = 'Set up automated…'
    expect(getTruncatedTitle(title)).toBe(expected)
  })
})
