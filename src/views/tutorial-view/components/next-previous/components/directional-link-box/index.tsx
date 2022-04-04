import React from 'react'
import classNames from 'classnames'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconArrowLeft16 } from '@hashicorp/flight-icons/svg-react/arrow-left-16'
import { IconSliders24 } from '@hashicorp/flight-icons/svg-react/sliders-24'
import CardLink from 'components/card-link'
import Text from 'components/text'
import { DirectionalLinkBoxProps, DirectionOption } from './types'
import s from './directional-link-box.module.css'

const IconDict: { [k in DirectionOption]: typeof IconArrowRight16 } = {
  next: IconArrowRight16,
  previous: IconArrowLeft16,
  final: IconSliders24,
}

function DirectionalLinkBox({
  link,
  label,
  title,
  direction,
}: DirectionalLinkBoxProps) {
  const Icon = IconDict[direction]

  /**
   * DirectionalLinkBox accepts link.href to match next/link.
   * When passing href to CardLink, we need to make sure href is a string.
   */
  const { href, as } = link
  const hrefString = typeof href == 'string' ? href : href.toString()

  return (
    <CardLink
      className={classNames(s.linkbox, s[`direction-${direction}`])}
      href={hrefString}
      as={as}
      aria-label={title}
    >
      <Icon className={classNames(s.icon, s[`direction-${direction}`])} />
      <Text asElement="span" className={s.text} size={200} weight="medium">
        {label}
      </Text>
    </CardLink>
  )
}

export default DirectionalLinkBox
