import {
  Fragment,
  KeyboardEventHandler,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react'
import classNames from 'classnames'
import { IconCaret16 } from '@hashicorp/flight-icons/svg-react/caret-16'
import { Product, ProductGroup } from 'types/products'
import { useCurrentProduct } from 'contexts'
import ProductIcon from 'components/product-icon'
import { products } from '../../../config/products'
import s from './product-switcher.module.css'

const OPTION_LIST_ID = 'product-chooser-option-list'
const OPTION_ID_PREFIX = 'product-chooser-list-item-'

const generateSwitcherOptionIdFromProduct = (product: Product) => {
  return `${OPTION_ID_PREFIX}${product.slug}`
}

const getFirstProduct = (products: Product[][]) => {
  return products[0][0]
}

const getLastProduct = (products: Product[][]) => {
  const lastProductGroup = products[products.length - 1]
  const lastProduct = lastProductGroup[lastProductGroup.length - 1]
  return lastProduct
}

const ProductSwitcher: React.FC = () => {
  const currentProduct = useCurrentProduct()
  const [isOpen, setIsOpen] = useState(false)
  const productChooserRef = useRef<HTMLDivElement>()
  const buttonRef = useRef<HTMLButtonElement>()
  const firstAnchorRef = useRef<HTMLAnchorElement>()
  const lastAnchorRef = useRef<HTMLAnchorElement>()
  const shouldFocusFirstAnchor = useRef<boolean>(false)
  const firstProduct = getFirstProduct(products)
  const lastProduct = getLastProduct(products)

  /* @TODO: handle case where there is no
     currentProduct, eg on the home page */

  useEffect(() => {
    if (!isOpen) {
      return
    }

    // Focuses the first anchor element if needed
    if (shouldFocusFirstAnchor.current) {
      firstAnchorRef.current.focus()
      shouldFocusFirstAnchor.current = false
    }

    const handleDocumentClick = (e) => {
      const isClickOutside = !productChooserRef.current.contains(e.target)
      if (isClickOutside) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleDocumentClick)

    return () => document.removeEventListener('click', handleDocumentClick)
  }, [isOpen])

  /**
   * It would be more optimal to set onKeyDown for the containing element, but
   * that is not allowed on a <div> with no role. We do not want to use a menu
   * role (see Adrian Roselli link below) so there is no role currently set on
   * the containing <div>. If we find an appropriate role, then we can change
   * the approach. For now, it's most appropriate to set onKeyDown on the
   * <button> and <ul>, hence this defintion:
   * `KeyboardEventHandler<HTMLButtonElement | HTMLUListElement>`.
   *
   * https://adrianroselli.com/2017/10/dont-use-aria-menu-roles-for-site-nav.html
   */
  const handleKeyDown: KeyboardEventHandler<
    HTMLButtonElement | HTMLUListElement
  > = (e) => {
    const isEscapeKey = e.key === 'Escape'
    const isEnterKey = e.key === 'Enter'
    const isSpaceKey = e.key === ' '

    /**
     * The reason we can't focus the first anchor here is because we have the
     * anchor element is not rendered until after `setIsOpen(true)` is called by
     * the <button>'s onClick (default behavior of <button> elements).
     *
     * Might be possible to do e.preventDefault and then do the focus() call
     * here? Not sure we need to do that though unless we are very against this
     * approach. I'd rather not prevent default behavior if we don't have to.
     */
    if (!isOpen && (isEnterKey || isSpaceKey)) {
      shouldFocusFirstAnchor.current = true
      return
    }

    if (isEscapeKey) {
      setIsOpen(false)
      buttonRef?.current?.focus()
      return
    }
  }

  const renderProductListItem = (product: Product): ReactElement => {
    const isFirstProduct = product.slug === firstProduct.slug
    const isLastProduct = product.slug === lastProduct.slug
    const isCurrentProduct = product.slug === currentProduct?.slug

    const handleAnchorKeyDown: KeyboardEventHandler<HTMLAnchorElement> = (
      e
    ) => {
      const isFirstItem = firstAnchorRef.current.contains(e.currentTarget)
      const isLastItem = lastAnchorRef.current.contains(e.currentTarget)
      if (!(isFirstItem || isLastItem)) {
        return
      }

      const isTabbingForward = !e.shiftKey && e.key === 'Tab'
      const isTabbingBackward = e.shiftKey && e.key === 'Tab'
      if (!(isTabbingForward || isTabbingBackward)) {
        return
      }

      if (isFirstItem && isTabbingBackward) {
        lastAnchorRef.current.focus()
        e.preventDefault()
      } else if (isLastItem && isTabbingForward) {
        firstAnchorRef.current.focus()
        e.preventDefault()
      }
    }

    let refToPass
    if (isFirstProduct) {
      refToPass = firstAnchorRef
    } else if (isLastProduct) {
      refToPass = lastAnchorRef
    }

    return (
      <li
        className={classNames(s.switcherOption, {
          [s.activeSwitcherOption]: isCurrentProduct,
        })}
        id={generateSwitcherOptionIdFromProduct(product)}
        key={product.slug}
      >
        <a
          aria-current={isCurrentProduct ? 'page' : undefined}
          className={classNames(
            s.switcherOptionAnchor,
            s.switcherOptionContainer
          )}
          href={product.url}
          onKeyDown={handleAnchorKeyDown}
          ref={refToPass}
        >
          <span className={s.focusContainer}>
            <ProductIcon
              className={s[`${product.slug}ProductIcon`]}
              productSlug={product.slug}
            />
            <span>{product.name}</span>
          </span>
        </a>
      </li>
    )
  }

  const renderProductGroup = (productGroup: ProductGroup, index: number) => {
    const shouldRenderHorizontalRule = index > 0
    return (
      <Fragment key={`product-group-${index}`}>
        {shouldRenderHorizontalRule && (
          <li className={s.separator} role="separator" />
        )}
        <li>
          <ul role="group">
            {productGroup.map((product) => renderProductListItem(product))}
          </ul>
        </li>
      </Fragment>
    )
  }

  /**
   * I _think_ we want the containing element to be a nav, currently clashes
   * with other styles so not using that element just yet
   */
  return (
    <div className={s.productSwitcher} ref={productChooserRef}>
      <button
        aria-controls={OPTION_LIST_ID}
        aria-expanded={isOpen}
        aria-labelledby={
          currentProduct
            ? generateSwitcherOptionIdFromProduct(currentProduct)
            : undefined
        }
        aria-label={currentProduct ? undefined : 'Product switcher'}
        className={s.switcherButton}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        onKeyDown={handleKeyDown}
        ref={buttonRef}
      >
        <span className={s.switcherOptionContainer}>
          <ProductIcon
            className={s[`${currentProduct?.slug}ProductIcon`]}
            productSlug={currentProduct?.slug}
          />
          <span>{currentProduct ? currentProduct.name : 'Products'}</span>
        </span>
        <IconCaret16 className={s.switcherCaret} />
      </button>
      <ul
        className={s.switcherOptionList}
        id={OPTION_LIST_ID}
        onKeyDown={handleKeyDown}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        {products.map(renderProductGroup)}
      </ul>
    </div>
  )
}

export default ProductSwitcher
