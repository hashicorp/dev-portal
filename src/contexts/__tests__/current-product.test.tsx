import { render, screen } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { Product } from 'types/products'
import {
  CurrentProductProvider,
  useCurrentProduct,
} from 'contexts/current-product'

describe('CurrentProductContext', () => {
  let useRouter: jest.SpyInstance
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockReturnValue({ events: { off: jest.fn(), on: jest.fn() } })
  })

  afterAll(() => {
    useRouter.mockRestore()
  })

  test('useCurrentProduct throws an error if not used within CurrentProductProvider', () => {
    const { result } = renderHook(() => useCurrentProduct())
    expect(result.error.message).toBe(
      'useCurrentProduct must be used within a CurrentProductProvider'
    )
  })

  test('CurrentProductProvider renders its children without changes', () => {
    const testText = 'super special unique text for testing'
    render(
      <CurrentProductProvider currentProduct={undefined}>
        {testText}
      </CurrentProductProvider>
    )

    expect(screen.getByText(testText)).toBeDefined()
  })

  test('useCurrentProduct returns the value provided to CurrentProductProvider', () => {
    const testProduct: Product = { slug: 'waypoint', name: 'Waypoint' }
    const wrapper = ({ children }) => (
      <CurrentProductProvider currentProduct={testProduct}>
        {children}
      </CurrentProductProvider>
    )
    const { result } = renderHook(() => useCurrentProduct(), { wrapper })
    expect(result.current).toEqual(testProduct)
  })
})
