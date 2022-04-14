import Link from 'next/link'
import Image from 'next/image'
import logo from '@hashicorp/mktg-logos/product/vault/primary/colorwhite.svg'
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
        <Text className={s.description}>Create your first secret</Text>
      </a>
    </Link>
  )
}
