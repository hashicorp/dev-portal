import Link from 'next/link'
import Image from 'next/image'
import logo from '@hashicorp/mktg-logos/product/waypoint/primary/colorwhite.svg'
import Heading from 'components/heading'
import Text from 'components/text'
import s from './waypoint-slot.module.css'

export default function WaypointSlot() {
  return (
    <Link href="/">
      <a className={s.root}>
        <Heading level={2} size={500} weight="bold" slug="hcp-vault">
          Waypoint
        </Heading>
        <Text className={s.description}>
          Things that Waypoint really excells at doing and is compelling.
        </Text>
      </a>
    </Link>
  )
}
