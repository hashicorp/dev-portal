import React from 'react'
import InlineSvg from '@hashicorp/react-inline-svg'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import slugify from 'slugify'
import Heading from 'components/heading'
import MaybeInternalLink from 'components/maybe-internal-link'
import Text from 'components/text'
import { GetStartedProps } from './types'
import s from './style.module.css'

function GetStarted({
  iconSvg,
  heading,
  text,
  link,
}: GetStartedProps): React.ReactElement {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <div className={s.iconSection}>
          <InlineSvg src={iconSvg} />
        </div>
        <div className={s.textSection}>
          <Heading
            className={s.heading}
            level={3}
            size={200}
            slug={slugify(heading)}
            weight="semibold"
          >
            {heading}
          </Heading>
          <Text className={s.text} size={200}>
            {text}
          </Text>
          <MaybeInternalLink className={s.link} href={link.url}>
            <Text asElement="span" size={200} weight="medium">
              {link.text}
            </Text>
            <IconArrowRight16 />
          </MaybeInternalLink>
        </div>
      </div>
    </div>
  )
}

export type { GetStartedProps }
export default GetStarted
