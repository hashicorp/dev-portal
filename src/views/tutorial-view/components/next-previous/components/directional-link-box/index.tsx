import React from 'react'
import Link, { LinkProps } from 'next/link'
import InlineSvg from '@hashicorp/react-inline-svg'
import s from './styles.module.css'

interface DirectionalLinkBoxProps {
  link: LinkProps
  label: string
  title: string
  direction: DirectionOption
}

type DirectionOption = 'next' | 'previous' | 'final'

/**
 *  @TODO: when we're redoing all icons figure out the most
 * performant way to dynamically require icons like this.
 * This pattern causes all those assets to load. Skateboard approach
 * for now as a larger icon refactor is on the horizon — re: new flight-icons lib
 */

const IconSrcDict: { [k in DirectionOption]: string } = {
  next: require(`@hashicorp/flight-icons/svg/chevron-right-24.svg?include`),
  previous: require(`@hashicorp/flight-icons/svg/chevron-left-24.svg?include`),
  final: require(`@hashicorp/flight-icons/svg/sliders-24.svg?include`),
}

function DirectionalLinkBox({
  link,
  label,
  title,
  direction,
}: DirectionalLinkBoxProps) {
  return (
    <Link href={link.href} as={link.as}>
      <a className={s.linkbox} data-direction={direction}>
        <span className={s.icon} data-direction={direction}>
          <InlineSvg src={IconSrcDict[direction]} />
        </span>
        <span className={s.text}>
          <span aria-hidden="true">{label}</span>
          <span className={s.hidden}>{title}</span>
        </span>
      </a>
    </Link>
  )
}

export default DirectionalLinkBox
