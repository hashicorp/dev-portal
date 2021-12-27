import React from 'react'
import InlineSvg from '@hashicorp/react-inline-svg'
import s from './style.module.css'
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
        <div className={s.icon}>
          <InlineSvg src={iconSvg} />
        </div>
        <div className={s.text}>
          <span>{heading}</span>
          <p>{text}</p>
          <a href={link.url}>{link.text}</a>
        </div>
      </div>
    </div>
  )
}

export type { GetStartedProps }
export default GetStarted
