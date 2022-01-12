import { createContext, FC, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Product } from 'types/products'

type CurrentProduct = Product | undefined

const CurrentProductContext = createContext<CurrentProduct>(undefined)

const CurrentProductProvider: FC<{ currentProduct: Product }> = ({
  children,
  currentProduct,
}) => {
  const router = useRouter()
  const [value, setValue] = useState<CurrentProduct>(currentProduct)

  /**
   * This effect is for clearing the current product on pages that do not have a
   * single product. This currently includes the main home page.
   *
   * This clear value MUST be `null` (not `undefined`) or `useCurrentProduct`
   * will throw its error.
   */
  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
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

const useCurrentProduct = (): Product => {
  const context = useContext(CurrentProductContext)
  if (context === undefined) {
    throw new Error(
      'useCurrentProduct must be used within a CurrentProductProvider'
    )
  }

  return context
}

export { CurrentProductProvider, useCurrentProduct }
