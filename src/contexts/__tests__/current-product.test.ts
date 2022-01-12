import { renderHook } from '@testing-library/react-hooks'
import { useCurrentProduct } from 'contexts/current-product'

describe('CurrentProductContext', () => {
  test('useCurrentProduct throws an error if not used within CurrentProductProvider', () => {
    const { result } = renderHook(() => useCurrentProduct())
    expect(result.error.message).toBe(
      'useCurrentProduct must be used within a CurrentProductProvider'
    )
  })
})
