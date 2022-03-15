import { createContext, FC, useContext } from 'react'
import { useRouter } from 'next/router'
import { Product } from 'types/products'

export type RouteChangeStartHandler = (url: string) => void

type CurrentProduct = Product | undefined

const CurrentProductContext = createContext<CurrentProduct>(undefined)

const CurrentProductProvider: FC<{ currentProduct: Product }> = ({
  children,
  currentProduct,
}) => {
  const router = useRouter()
  const value = router.asPath === '/' ? null : currentProduct

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
