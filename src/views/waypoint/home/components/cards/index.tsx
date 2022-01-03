import React from 'react'
import Link from 'next/link'
import InlineSvg from '@hashicorp/react-inline-svg'
import classNames from 'classnames'
import tagIconDict from './tag-icon-dict.json'
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
              {/* TODO: use href from props, rather than always same link */}
              <Link href="/waypoint/docs/intro">
                <a className={s.card}>
                  {iconSvg && (
                    <span className={s.cardIcon}>
                      <InlineSvg src={iconSvg} />
                    </span>
                  )}
                  <span className={s.cardHeading}>{heading}</span>
                  <span className={s.cardText}>{text}</span>
                  {tags && (
                    <span className={s.cardTags}>
                      {tags.map((tag) => {
                        return <InlineSvg key={tag} src={tagIconDict[tag]} />
                      })}
                    </span>
                  )}
                </a>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export type { CardProps }
export default Cards
