import Image from 'next/image'
import VisuallyHidden from '@reach/visually-hidden'
import logo from '@hashicorp/mktg-logos/product/vault/primary/color.svg'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import CardLink from 'components/card-link'
import Text from 'components/text'
import s from './vault-slot.module.css'

function VaultSlot() {
  return (
    <CardLink href="/" className={s.root}>
      <VisuallyHidden as="h2">Vault</VisuallyHidden>
      <div className={s.logo}>
        <Image src={logo} width={118} height={50} alt="" />
      </div>
      <Text className={s.description} weight="bold">
        Access Vault’s secrets management and encryption capabilities instantly
        using the HCP portal
      </Text>
      <p className={s.cta}>
        Learn more <IconArrowRight16 />
      </p>
    </CardLink>
  )
}

export { VaultSlot }
