import React from 'react'
import Link, { LinkProps } from 'next/link'
import InlineSvg from '@hashicorp/react-inline-svg'
import s from './directional-link-box.module.css'

interface DirectionalLinkBoxProps {
  link: LinkProps
  label: string
  title: string
  direction: DirectionOption
}

type DirectionOption = 'next' | 'previous' | 'final'

const IconSrcDict: { [k in DirectionOption]: string } = {
  next: require(`@hashicorp/flight-icons/svg/arrow-right-16.svg?include`),
  previous: require(`@hashicorp/flight-icons/svg/arrow-left-16.svg?include`),
  final: require(`@hashicorp/flight-icons/svg/sliders-24.svg?include`),
}

/*
 * @TODO style to spec
 * look at the `CardLink` component to use for base styles!
 */

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
