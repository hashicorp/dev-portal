import Link from 'next/link'
import Heading from 'components/heading'
import Text from 'components/text'
import s from './hcp-vault-slot.module.css'

export default function HcpVaultSlot() {
  return (
    <Link href="/">
      <a className={s.root}>
        <Heading level={2} size={500} weight="bold" slug="hcp-vault">
          HCP Vault
        </Heading>
        <Text className={s.description}>
          Quickly get hands-on with HashiCorp Cloud Platform (HCP) Vault using
          the HCP portal and setup your managed Vault cluster.
        </Text>
      </a>
    </Link>
  )
}
