import React from 'react'
import s from './style.module.css'

interface Card {
  iconSvg?: string
  heading: string
  text: string
  url: string
  tags?: string[]
}

function Cards({
  columns,
  cards,
}: {
  columns: number
  cards: Card[]
}): React.ReactElement {
  return (
    <div className={s.root}>
      Cards{' '}
      <pre>
        <code>{JSON.stringify({ columns, cards }, null, 2)}</code>
      </pre>
    </div>
  )
}

export default Cards
