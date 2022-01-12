import { render, screen } from '@testing-library/react'
import waypointData from 'data/waypoint.json'
import { Product } from 'types/products'
import { CurrentProductProvider } from 'contexts'
import DocsAnchor from '../'

const product = waypointData as Product

describe('DocsAnchor', () => {
  let useRouter: jest.SpyInstance
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockReturnValue({ events: { off: jest.fn(), on: jest.fn() } })
  })

  afterAll(() => {
    useRouter.mockRestore()
  })

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
