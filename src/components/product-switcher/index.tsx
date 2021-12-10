import { KeyboardEventHandler, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { IconCaret16 } from '@hashicorp/flight-icons/svg-react/caret-16'
import { ProductCode } from 'common/types'
import ProductIcon from 'components/icons/product-icon'
import s from './style.module.css'

const products: { name: string; code: ProductCode; url: string }[] = [
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

// TODO: make this functional (ref: https://app.asana.com/0/1201010428539925/1201247589988629/f)
const ProductSwitcher: React.FC = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>()
  const currentProductCode = router.asPath.split('/')[1]

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
    if (!isOpen) {
      return
    }

    if (e.key === 'Escape') {
      setIsOpen(false)
      buttonRef?.current?.focus()
    }
  }

  /**
   * I _think_ we want the containing element to be a nav, currently clashes with other
   * styles so not using that element just yet
   */
  return (
    <div className={s.productSwitcher}>
      <button
        aria-controls="product-chooser-product-list"
        aria-expanded={isOpen}
        aria-labelledby={`product-chooser-list-item-${currentProductCode}`}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        onKeyDown={handleKeyDown}
      >
        <div className={s.iconAndNameContainer}>
          <ProductIcon product="waypoint" />
          <span>Waypoint</span>
        </div>
        <IconCaret16 />
      </button>
      <ul
        id="product-chooser-product-list"
        style={{ display: isOpen ? 'block' : 'none' }}
        onKeyDown={handleKeyDown}
      >
        {products.map((product) => {
          const isCurrent = product.code === currentProductCode

          return (
            <li
              id={`product-chooser-list-item-${product.code}`}
              key={product.code}
            >
              <a
                aria-current={isCurrent ? 'page' : undefined}
                href={product.url}
              >
                <ProductIcon product={product.code} />
                <span>{product.name}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ProductSwitcher
