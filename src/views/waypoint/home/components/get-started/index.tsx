import React from 'react'
import InlineSvg from '@hashicorp/react-inline-svg'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import s from './style.module.css'
import MaybeInternalLink from '../../../../../components/maybe-internal-link'
import { GetStartedProps } from './types'

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
          <h3 className={s.heading}>{heading}</h3>
          <p className={s.text}>{text}</p>
          <MaybeInternalLink className={s.link} href={link.url}>
            {link.text}
            <IconArrowRight16 />
          </MaybeInternalLink>
        </div>
      </div>
    </div>
  )
}

export type { GetStartedProps }
export default GetStarted
