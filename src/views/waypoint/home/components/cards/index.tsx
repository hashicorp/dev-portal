import React from 'react'
import classNames from 'classnames'
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
      <div className={classNames(s.cards, s[`columns-${columns}`])}>
        {cards.map((card, idx) => {
          return (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              className={classNames(s.cardWrapper, s[`columns-${columns}`])}
            >
              <div className={s.card}>
                <pre>
                  <code>{JSON.stringify(card, null, 2)}</code>
                </pre>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Cards
