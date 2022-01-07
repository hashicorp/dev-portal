import { render, screen } from '@testing-library/react'
import { CurrentProductProvider } from 'contexts'
import waypointData from 'data/waypoint.json'
import { Product } from 'types/products'
import DocsAnchor from '../'

const product = waypointData as Product

describe('DocsAnchor', () => {
  test('rewrites internal links based on props to the factory function', async () => {
    render(
      <CurrentProductProvider currentProduct={product}>
        <DocsAnchor href="/docs/some/page">This is a link</DocsAnchor>
      </CurrentProductProvider>
    )

    const result = screen.queryByText('This is a link')

    expect(result).toHaveAttribute('href', '/waypoint/docs/some/page')
  })
})
