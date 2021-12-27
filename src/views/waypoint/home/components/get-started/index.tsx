import React from 'react'
import s from './style.module.css'

interface GetStartedProps {
  iconSvg: string
  heading: string
  text: string
  link: {
    url: string
    text: string
  }
}

function GetStarted({
  iconSvg,
  heading,
  text,
  link,
}: GetStartedProps): React.ReactElement {
  return (
    <div className={s.root}>
      <pre>
        <code>{JSON.stringify({ iconSvg, heading, text, link }, null, 2)}</code>
      </pre>
    </div>
  )
}

export default GetStarted
