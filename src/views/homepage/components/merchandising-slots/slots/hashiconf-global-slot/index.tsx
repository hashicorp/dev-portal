import Image from 'next/image'
import VisuallyHidden from '@reach/visually-hidden'
import { IconHashicorp24 } from '@hashicorp/flight-icons/svg-react/hashicorp-24'
import CardLink from 'components/card-link'
import Text from 'components/text'
import s from './hashiconf-global-slot.module.css'

export default function HashiConfGlobalSlot() {
  return (
    <CardLink href="/" className={s.root}>
      <header className={s.header}>
        <VisuallyHidden as="h2">HashiConf Global</VisuallyHidden>
        <Image
          src="/img/homepage/hashiconf-global-logo.svg"
          width="194"
          height="83"
          alt="HashiConf Global"
        />
        <IconHashicorp24 />
      </header>

      <footer className={s.footer}>
        <Text className={s.description}>
          October 4-6, 2O22 (PST) <br /> Los Angeles & Virtual
        </Text>
        <Text className={s.description}>hashiconf.com</Text>
      </footer>
    </CardLink>
  )
}
