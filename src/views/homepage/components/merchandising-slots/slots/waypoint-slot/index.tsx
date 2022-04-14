import Link from 'next/link'
import Image from 'next/image'
import VisuallyHidden from '@reach/visually-hidden'
import logo from '@hashicorp/mktg-logos/product/waypoint/primary/colorwhite.svg'
import Text from 'components/text'
import s from './waypoint-slot.module.css'

export default function WaypointSlot() {
  return (
    <Link href="/">
      <a className={s.root}>
        <VisuallyHidden as="h2">Waypoint</VisuallyHidden>
        <Image src={logo} width={188} height={50} alt="" />
        <Text className={s.description} weight="semibold">
          Things that Waypoint really excells at doing and is compelling.
        </Text>
      </a>
    </Link>
  )
}
