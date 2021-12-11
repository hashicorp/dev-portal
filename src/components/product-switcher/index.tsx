import {
  KeyboardEventHandler,
  ReactElement,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { IconCaret16 } from '@hashicorp/flight-icons/svg-react/caret-16'
import { Product } from 'common/types'
import ProductIcon from 'components/icons/product-icon'
import s from './style.module.css'

// TODO: should we put this somewhere else for easier reuse?
const products: Product[] = [
  {
    name: 'Terraform',
    code: 'terraform',
    url: 'https://www.terraform.io/docs/index.html',
  },
  {
    name: 'Packer',
    code: 'packer',
    url: 'https://www.packer.io/docs',
  },
  {
    name: 'Consul',
    code: 'consul',
    url: 'https://www.consul.io/docs',
  },
  {
    name: 'Vault',
    code: 'vault',
    url: 'https://www.vaultproject.io/docs',
  },
  {
    name: 'Boundary',
    code: 'boundary',
    url: 'https://www.boundaryproject.io/docs',
  },
  {
    name: 'Nomad',
    code: 'nomad',
    url: 'https://www.nomadproject.io/docs',
  },
  {
    name: 'Waypoint',
    code: 'waypoint',
    url: 'https://www.waypointproject.io/docs',
  },
  {
    name: 'Vagrant',
    code: 'vagrant',
    url: 'https://www.vagrantup.com/docs',
  },
  {
    name: 'Sentinel',
    code: 'sentinel',
    url: 'https://docs.hashicorp.com/sentinel',
  },
  {
    name: 'HashiCorp Cloud Platform',
    code: 'hcp',
    url: 'https://cloud.hashicorp.com/docs/hcp',
  },
]

const getAllAnchorElements = () => {
  const listElement = document.getElementById('product-chooser-product-list')
  const anchorElements = listElement.querySelectorAll('a')
  return anchorElements
}

const ProductSwitcher: React.FC = () => {
  const router = useRouter()
  const currentProductCode = router.asPath.split('/')[1]
  const [isOpen, setIsOpen] = useState(false)
  const productChooserRef = useRef<HTMLDivElement>()
  const buttonRef = useRef<HTMLButtonElement>()
  const shouldFocusFirstAnchor = useRef<boolean>(false)

  useLayoutEffect(() => {
    if (!isOpen) {
      return
    }

    // Focuses the first anchor element if needed
    if (shouldFocusFirstAnchor.current) {
      const firstAnchorElement = getAllAnchorElements()[0]
      firstAnchorElement.focus()
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
   * It would be more optimal to set onKeyDown for the containing element, but that is not allowed
   * on a <div> with no role. We do not want to use a menu role (see https://adrianroselli.com/2017/10/dont-use-aria-menu-roles-for-site-nav.html)
   * so there is no role currently set on the containing <div>. If we find an appropriate role, then we can
   * change the approach. For now, it's most appropriate to set onKeyDown on the <button> and <ul>,
   * hence the `KeyboardEventHandler<HTMLButtonElement | HTMLUListElement>` definition.
   */
  const handleKeyDown: KeyboardEventHandler<
    HTMLButtonElement | HTMLUListElement
  > = (e) => {
    const isEscapeKey = e.key === 'Escape'
    const isEnterKey = e.key === 'Enter'
    const isSpaceKey = e.key === ' '

    /**
     * The reason we can't focus the first anchor here is because we have the anchor element
     * is not rendered until after `setIsOpen(true)` is called by the <button>'s onClick (default
     * behavior of <button> elements).
     *
     * Might be possible to do e.preventDefault and then do the focus() call here? Not sure we
     * need to do that though unless we are very against this approach. I'd rather not prevent
     * default behavior if we don't have to.
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

  const renderProductListItem = (
    product: Product,
    index: number
  ): ReactElement => {
    const isCurrentProduct = product.code === currentProductCode

    const handleAnchorKeyDown: KeyboardEventHandler<HTMLAnchorElement> = (
      e
    ) => {
      const lastIndex = products.length - 1
      const isFirstItem = index === 0
      const isLastItem = index === lastIndex
      if (!(isFirstItem || isLastItem)) {
        return
      }

      const isTabbingForward = !e.shiftKey && e.key === 'Tab'
      const isTabbingBackward = e.shiftKey && e.key === 'Tab'
      if (!(isTabbingForward || isTabbingBackward)) {
        return
      }

      const anchorElements = getAllAnchorElements()
      if (isFirstItem && isTabbingBackward) {
        const lastAnchorElement = anchorElements[lastIndex]
        lastAnchorElement.focus()
        e.preventDefault()
      } else if (isLastItem && isTabbingForward) {
        const firstAnchorElement = anchorElements[0]
        firstAnchorElement.focus()
        e.preventDefault()
      }
    }

    return (
      <li
        className={s.switcherOption}
        id={`product-chooser-list-item-${product.code}`}
        key={product.code}
      >
        <a
          aria-current={isCurrentProduct ? 'page' : undefined}
          className={classNames(
            s.switcherOptionAnchor,
            s.switcherOptionContainer
          )}
          href={product.url}
          onKeyDown={handleAnchorKeyDown}
        >
          <ProductIcon product={product.code} />
          <span>{product.name}</span>
        </a>
      </li>
    )
  }

  /**
   * I _think_ we want the containing element to be a nav, currently clashes with other
   * styles so not using that element just yet
   */
  return (
    <div className={s.productSwitcher} ref={productChooserRef}>
      <button
        aria-controls="product-chooser-product-list"
        aria-expanded={isOpen}
        aria-labelledby={`product-chooser-list-item-${currentProductCode}`}
        className={s.switcherButton}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        onKeyDown={handleKeyDown}
        ref={buttonRef}
      >
        <div className={s.switcherOptionContainer}>
          <ProductIcon product="waypoint" />
          <span>Waypoint</span>
        </div>
        <IconCaret16 className={s.switcherCaret} />
      </button>
      <ul
        className={s.switcherOptionList}
        id="product-chooser-product-list"
        style={{ display: isOpen ? 'block' : 'none' }}
        onKeyDown={handleKeyDown}
      >
        {products.map(renderProductListItem)}
      </ul>
    </div>
  )
}

export default ProductSwitcher
