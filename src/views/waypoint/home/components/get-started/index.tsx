import React from 'react'
import s from './style.module.css'

interface GetStartedProps {
  heading: string
  text: string
  link: {
    url: string
    text: string
  }
}

function GetStarted({
  heading,
  text,
  link,
}: GetStartedProps): React.ReactElement {
  return (
    <div className={s.root}>
      GetStarted{' '}
      <pre>
        <code>{JSON.stringify({ heading, text, link }, null, 2)}</code>
      </pre>
    </div>
  )
}

export default GetStarted
