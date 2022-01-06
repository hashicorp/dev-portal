import { createContext, FC, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Product } from 'types/products'

// TODO: this is temporary for testing
const DEFAULT_PRODUCT: Product = {
  name: 'Waypoint',
  slug: 'waypoint',
  url: '/waypoint',
}

type CurrentProduct = Product

const CurrentProductContext = createContext<CurrentProduct | undefined>(
  DEFAULT_PRODUCT
)

const CurrentProductProvider: FC<{ currentProduct: Product }> = ({
  children,
  currentProduct,
}) => {
  const router = useRouter()
  const [value, setValue] = useState(currentProduct)

  /**
   * This effect is for clearing the current product on pages that do not have a
   * single product. This currently includes the main home page.
   */
  useEffect(() => {
    const handleRouteChangeStart = (url) => {
      if (url === '/') {
        setValue(null)
      }
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)

    return () => router.events.off('routeChangeStart', handleRouteChangeStart)
  }, [])

  return (
    <CurrentProductContext.Provider value={value}>
      {children}
    </CurrentProductContext.Provider>
  )
}

const useCurrentProduct = (): CurrentProduct => {
  const context = useContext(CurrentProductContext)
  if (context === undefined) {
    throw new Error(
      'useCurrentProduct must be used within a CurrentProductProvider'
    )
  }

  return context
}

export { CurrentProductProvider, useCurrentProduct }
