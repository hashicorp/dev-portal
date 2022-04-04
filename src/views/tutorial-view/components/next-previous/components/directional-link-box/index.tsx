import React from 'react'
import InlineSvg from '@hashicorp/react-inline-svg'
import classNames from 'classnames'
import s from './directional-link-box.module.css'
import { DirectionalLinkBoxProps, DirectionOption } from './types'
import CardLink from 'components/card-link'

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
    <CardLink
      className={classNames(s.linkbox, s[`direction-${direction}`])}
      href={`${link.href}`}
      as={`${link.as}`}
      aria-label={title}
    >
      <span className={classNames(s.icon, s[`direction-${direction}`])}>
        <InlineSvg src={IconSrcDict[direction]} />
      </span>
      <span className={s.text}>{label}</span>
    </CardLink>
  )
}

export default DirectionalLinkBox
