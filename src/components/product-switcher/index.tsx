import { useState } from 'react'
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
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={s.productSwitcher}>
      <button
        onBlur={(e) => console.log('blur event', e)}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        <div className={s.iconAndNameContainer}>
          <ProductIcon product="waypoint" />
          <span>Waypoint</span>
        </div>
        <IconCaret16 />
      </button>
      {isOpen && (
        <ul>
          {products.map((product) => (
            <li key={product.code}>
              <a href={product.url}>
                <ProductIcon product={product.code} />
                <span>{product.name}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ProductSwitcher
