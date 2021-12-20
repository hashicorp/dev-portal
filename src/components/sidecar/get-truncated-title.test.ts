import getTruncatedTitle from './get-truncated-title'

describe('getTruncatedTitle', () => {
  it('leaves a short title unmodified', () => {
    const title = 'Hello world'
    expect(getTruncatedTitle(title)).toBe(title)
  })

  it('does not add ... to a title of exact limit length', () => {
    const title = 'contrib Tools and Helpers'
    const expected = 'contrib Tools and...'
    expect(getTruncatedTitle(title)).toBe(expected)
  })

  /* @TODO

  It might be nice to use CSS truncation
  as it might better meet these types of
  use cases. We can lean on the browser's
  hyphenation-style parsing of words,
  which can result in clean and human-ish
  word breaking.

  See for context:
  https://css-tricks.com/snippets/css/truncate-string-with-ellipsis/

  For example, we'd likely prefer:
  "Set up automated infra..."
  over the current:
  "Set up automated..."
  On top of this, CSS truncation might better
  account for differences in letter widths,
  which we currently have to approximate for
  using a character count that is somewhat
  entangled with the layout specifics
  (ie available width) of the component
  being rendered.
  
  */
  it('handles titles that end in long words', () => {
    const title = 'Set up automated infrastructure'
    const expected = 'Set up automated...'
    expect(getTruncatedTitle(title)).toBe(expected)
  })
})
