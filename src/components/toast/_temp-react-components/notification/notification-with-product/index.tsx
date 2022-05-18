import * as React from 'react'
import type {
  NotificationProducts,
  NotificationWithProductProps,
} from '../types'
import Notification from '../notification'
import { IconBoundaryColor24 } from '@hashicorp/flight-icons/svg-react/boundary-color-24'
import { IconConsulColor24 } from '@hashicorp/flight-icons/svg-react/consul-color-24'
import { IconNomadColor24 } from '@hashicorp/flight-icons/svg-react/nomad-color-24'
import { IconPackerColor24 } from '@hashicorp/flight-icons/svg-react/packer-color-24'
import { IconTerraformColor24 } from '@hashicorp/flight-icons/svg-react/terraform-color-24'
import { IconVaultColor24 } from '@hashicorp/flight-icons/svg-react/vault-color-24'
import { IconVagrantColor24 } from '@hashicorp/flight-icons/svg-react/vagrant-color-24'
import { IconWaypointColor24 } from '@hashicorp/flight-icons/svg-react/waypoint-color-24'
import s from '../style.module.css'

const PRODUCT_MAP: {
  [key in NotificationProducts]: {
    name: string
    icon: React.ReactNode
  }
} = {
  boundary: {
    name: 'Boundary',
    icon: <IconBoundaryColor24 />,
  },
  consul: {
    name: 'Consul',
    icon: <IconConsulColor24 />,
  },
  nomad: {
    name: 'Nomad',
    icon: <IconNomadColor24 />,
  },
  packer: {
    name: 'Packer',
    icon: <IconPackerColor24 />,
  },
  terraform: {
    name: 'Terraform',
    icon: <IconTerraformColor24 />,
  },
  vault: {
    name: 'Vault',
    icon: <IconVaultColor24 />,
  },
  vagrant: {
    name: 'Vagrant',
    icon: <IconVagrantColor24 />,
  },
  waypoint: {
    name: 'Waypoint',
    icon: <IconWaypointColor24 />,
  },
}

export default function NotificationWithProduct(
  props: NotificationWithProductProps
) {
  const { product, ...rest } = props
  return (
    <Notification {...rest}>
      <div className={s.product}>
        <span className={s.productIcon}>{PRODUCT_MAP[product].icon}</span>{' '}
        <span className={s.productName}>{PRODUCT_MAP[product].name}</span>
      </div>
    </Notification>
  )
}
