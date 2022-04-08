import { createContext, ReactNode, useContext, useMemo } from 'react'
import { ProductSlug } from 'types/products'
import { productSlugsToNames } from '../../config/products'

/**
 * Describes the shape of each product's state manged by this Context.
 */
interface ProductState {
  isBetaProduct: boolean
}

/**
 * Describes the shape of the state object this Context manages.
 *
 * NOTE this cannot be an interface or an error occurs: "A mapped type may not
 * declare properties or methods"
 *
 * see: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
 */
type ContextState = {
  [key in ProductSlug]?: ProductState
}

/**
 * Returns an array of all product slugs.
 */
const initializeAllProductSlugs = () => {
  return Object.keys(productSlugsToNames) as ProductSlug[]
}

/**
 * Returns the inital state this Context manages. Currently derives an
 * `isBetaProduct` boolean for each product, and can be extended here to derive
 * more booleans in the future.
 */
const initalizeState = (allProductSlugs: ProductSlug[]): ContextState => {
  const result = {}

  // initalize the state object for each product
  const defaultProductState: ProductState = { isBetaProduct: false }
  allProductSlugs.forEach((slug: ProductSlug) => {
    // This needs to be a copy since we modify the object while deriving state
    result[slug] = { ...defaultProductState }
  })

  // derive `isBetaProduct` state booleans from config
  const betaProductSlugs = __config.dev_dot.beta_product_slugs
  betaProductSlugs.forEach((slug: ProductSlug) => {
    result[slug].isBetaProduct = true
  })

  return result
}

const AllProductDataContext = createContext<ContextState>(undefined)

/**
 * Describes the props interface for this Context's Provider.
 */
interface AllProductDataProviderProps {
  children: ReactNode
}

/**
 * Maintains a state object with derived Product data for every Product. Enables
 * us to derive information about Products (such as `isBetaProduct`) one time
 * for the entire app, rather than having to derive the same information each
 * time it is needed.
 */
const AllProductDataProvider = ({ children }: AllProductDataProviderProps) => {
  const allProductSlugs = useMemo(initializeAllProductSlugs, [])
  // NOTE: can safely disable since `allProductSlugs` is static
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const state: ContextState = useMemo(() => initalizeState(allProductSlugs), [])

  return (
    <AllProductDataContext.Provider value={state}>
      {children}
    </AllProductDataContext.Provider>
  )
}

/**
 * Given a `ProductSlug`, returns `true` if the associated Product is a beta
 * product and `false` otherwise.
 */
const useIsBetaProduct = (productSlug: ProductSlug): boolean => {
  const context = useContext(AllProductDataContext)
  if (context === undefined) {
    throw new Error(
      'useIsBetaProduct must be used within a CurrentProductProvider'
    )
  }

  return context[productSlug].isBetaProduct
}

export { AllProductDataProvider, useIsBetaProduct }
