import React from 'react'
import InlineSvg from '@hashicorp/react-inline-svg'
import classNames from 'classnames'
import { CardProps } from './types'
import s from './style.module.css'

function Cards({ columns, cards }: CardProps): React.ReactElement {
  return (
    <div className={s.root}>
      <div className={classNames(s.cards, s[`columns-${columns}`])}>
        {cards.map((card, idx) => {
          const { iconSvg, heading, text, tags } = card
          return (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              className={classNames(s.cardWrapper, s[`columns-${columns}`])}
            >
              <div className={s.card}>
                {iconSvg && (
                  <span className={s.cardIcon}>
                    <InlineSvg src={iconSvg} />
                  </span>
                )}
                <span className={s.cardHeading}>{heading}</span>
                <span className={s.cardText}>{text}</span>
                <span className={s.cardTags}>{JSON.stringify(tags)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export type { CardProps }
export default Cards
