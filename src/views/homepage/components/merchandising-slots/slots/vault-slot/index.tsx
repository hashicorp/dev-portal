import Link from 'next/link'
import Image from 'next/image'
import VisuallyHidden from '@reach/visually-hidden'
import logo from '@hashicorp/mktg-logos/product/vault/primary/colorwhite.svg'
import { IconClock16 } from '@hashicorp/flight-icons/svg-react/clock-16'
import Text from 'components/text'
import s from './vault-slot.module.css'

export default function VaultSlot() {
  return (
    <Link href="/">
      <a className={s.root}>
        <VisuallyHidden as="h2">Vault</VisuallyHidden>
        <Image src={logo} width={118} height={50} alt="" />
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
