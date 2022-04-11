import { CSSProperties, ReactElement } from 'react'
import Link from 'next/link'
import type { Product, ProductSlug } from 'types/products'
import getIsBetaProduct from 'lib/get-is-beta-product'
import { IconTerraform24 } from '@hashicorp/flight-icons/svg-react/terraform-24'
import { IconTerraformColor24 } from '@hashicorp/flight-icons/svg-react/terraform-color-24'
import { IconPacker24 } from '@hashicorp/flight-icons/svg-react/packer-24'
import { IconPackerColor24 } from '@hashicorp/flight-icons/svg-react/packer-color-24'
import { IconConsul24 } from '@hashicorp/flight-icons/svg-react/consul-24'
import { IconConsulColor24 } from '@hashicorp/flight-icons/svg-react/consul-color-24'
import { IconVault24 } from '@hashicorp/flight-icons/svg-react/vault-24'
import { IconVaultColor24 } from '@hashicorp/flight-icons/svg-react/vault-color-24'
import { IconBoundary24 } from '@hashicorp/flight-icons/svg-react/boundary-24'
import { IconBoundaryColor24 } from '@hashicorp/flight-icons/svg-react/boundary-color-24'
import { IconNomad24 } from '@hashicorp/flight-icons/svg-react/nomad-24'
import { IconNomadColor24 } from '@hashicorp/flight-icons/svg-react/nomad-color-24'
import { IconWaypoint24 } from '@hashicorp/flight-icons/svg-react/waypoint-24'
import { IconWaypointColor24 } from '@hashicorp/flight-icons/svg-react/waypoint-color-24'
import { IconVagrant24 } from '@hashicorp/flight-icons/svg-react/vagrant-24'
import { IconVagrantColor24 } from '@hashicorp/flight-icons/svg-react/vagrant-color-24'
import Text from 'components/text'
import s from './product-nav.module.css'

const productIcons: {
  [key in Exclude<ProductSlug, 'sentinel' | 'hcp'>]: {
    neutral: ReactElement
    color: ReactElement
  }
} = {
  terraform: {
    neutral: <IconTerraform24 />,
    color: <IconTerraformColor24 />,
  },
  packer: {
    neutral: <IconPacker24 />,
    color: <IconPackerColor24 />,
  },
  consul: {
    neutral: <IconConsul24 />,
    color: <IconConsulColor24 />,
  },
  vault: {
    neutral: <IconVault24 />,
    color: <IconVaultColor24 />,
  },
  boundary: {
    neutral: <IconBoundary24 />,
    color: <IconBoundaryColor24 />,
  },
  nomad: {
    neutral: <IconNomad24 />,
    color: <IconNomadColor24 />,
  },
  waypoint: {
    neutral: <IconWaypoint24 />,
    color: <IconWaypointColor24 />,
  },
  vagrant: {
    neutral: <IconVagrant24 />,
    color: <IconVagrantColor24 />,
  },
}

interface ProductNavProps {
  notice?: string
  products: Array<Product>
}

export default function ProductNav({ notice, products }: ProductNavProps) {
  return (
    <div>
      {notice ? <p className={s.notice}>{notice}</p> : null}
      <nav className={s.nav}>
        <ul className={s.list}>
          {products.map((product) => {
            const isBetaProduct = getIsBetaProduct(product.slug)
            return (
              <li className={s.listItem} key={product.slug}>
                {isBetaProduct ? (
                  <Link href={`/${product.slug}/`}>
                    <a
                      className={s.product}
                      style={
                        {
                          '--product-color': `var(--${product.slug})`,
                        } as CSSProperties
                      }
                    >
                      {productIcons[product.slug].color}
                      <Text
                        weight="medium"
                        className={s.productName}
                        asElement="span"
                      >
                        {product.name}
                      </Text>
                    </a>
                  </Link>
                ) : (
                  <span className={s.product}>
                    {productIcons[product.slug].neutral}
                    <Text
                      weight="medium"
                      className={s.productName}
                      asElement="span"
                    >
                      {product.name}
                    </Text>
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
