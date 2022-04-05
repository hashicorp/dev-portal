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
  href,
  label,
  ariaLabel,
  direction,
}: DirectionalLinkBoxProps) {
  const Icon = IconDict[direction]

  return (
    <CardLink
      className={classNames(s.linkbox, s[`direction-${direction}`])}
      href={href}
      ariaLabel={ariaLabel}
    >
      <Icon className={classNames(s.icon, s[`direction-${direction}`])} />
      <Text className={s.text} asElement="span" size={200} weight="medium">
        {label}
      </Text>
    </CardLink>
  )
}

export default DirectionalLinkBox
