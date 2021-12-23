import { render, screen } from '@testing-library/react'
import makeDocsAnchor from '..'

describe('DocsAnchor', () => {
  test('rewrites internal links based on props to the factory function', async () => {
    const DocsAnchor = makeDocsAnchor('waypoint', ['docs'])

    render(<DocsAnchor href="/docs/some/page">This is a link</DocsAnchor>)

    const result = screen.queryByText('This is a link')

    expect(result).toHaveAttribute('href', '/waypoint/docs/some/page')
  })
})
