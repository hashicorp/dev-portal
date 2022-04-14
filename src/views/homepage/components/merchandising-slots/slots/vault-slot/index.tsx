import Link from 'next/link'
import Image from 'next/image'
import logo from '@hashicorp/mktg-logos/product/vault/primary/colorwhite.svg'
import { IconClock16 } from '@hashicorp/flight-icons/svg-react/clock-16'
import Heading from 'components/heading'
import Text from 'components/text'
import s from './vault-slot.module.css'

export default function VaultSlot() {
  return (
    <Link href="/">
      <a className={s.root}>
        <Heading level={2} size={500} weight="bold" slug="hcp-vault">
          Vault
        </Heading>
        <Text className={s.description} weight="semibold">
          Create your first secret
        </Text>
        <p className={s.duration}>
          <IconClock16 /> 45 mins
        </p>
      </a>
    </Link>
  )
}
