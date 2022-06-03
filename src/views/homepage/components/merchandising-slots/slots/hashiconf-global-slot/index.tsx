import Image from 'next/image'
import VisuallyHidden from '@reach/visually-hidden'
import CardLink from 'components/card-link'
import Text from 'components/text'
import s from './hashiconf-global-slot.module.css'

function HashiConfGlobalSlot() {
  return (
    <CardLink
      href="https://hashiconf.com/global/"
      className={s.root}
      target="_blank"
    >
      <VisuallyHidden as="h2">HashiConf Global</VisuallyHidden>
      <Image
        src="/img/homepage/hashiconf-global-logo.svg"
        width="232"
        height="26"
        alt=""
      />
      <Text className={s.description} weight="bold">
        Two days of inspirational speakers, community connection, and a
        front-row seat to future of cloud.
      </Text>
      <footer className={s.footer}>
        <Text weight="medium">
          October 4-6, 2O22 (PST) <br /> Los Angeles & Virtual
        </Text>
        <Text weight="medium">hashiconf.com</Text>
      </footer>
    </CardLink>
  )
}

export { HashiConfGlobalSlot }
