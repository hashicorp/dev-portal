import React from 'react'
import InlineSvg from '@hashicorp/react-inline-svg'
import classNames from 'classnames'
import iconDict from './icon-dict'
import tagIconDict from './tag-icon-dict'
import { CardProps } from './types'
import CardLink from 'components/card-link'
import Text from 'components/text'
import s from './style.module.css'
import IconTile from 'components/icon-tile'

function Cards({ columns, cards }: CardProps): React.ReactElement {
  return (
    <div className={s.root}>
      <div className={classNames(s.cards, s[`columns-${columns}`])}>
        {cards.map((card, idx) => {
          const { icon, iconBrandColor, heading, text, tags, url } = card
          const IconSvg = icon ? iconDict[icon] : null
          if (icon && !iconDict[icon]) {
            throw new Error(
              `Icon with key "${icon}" does not seem to be present in the ProductLanding Card component's icon dictionary. Please use one of the existing icons, or add the new icon "${icon}" to the icon dictionary. Existing icons: ${JSON.stringify(
                Object.keys(iconDict)
              )}.`
            )
          }

          return (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              className={classNames(s.cardWrapper, s[`columns-${columns}`])}
            >
              {/* TODO: use href from props, rather than always same link */}
              <CardLink className={s.card} href={url}>
                {IconSvg ? (
                  <span className={s.cardIcon}>
                    <IconTile size={'small'} brandColor={iconBrandColor}>
                      <IconSvg />
                    </IconTile>
                  </span>
                ) : null}
                {/* TODO: should we update this to use body sizes instead of display? */}
                <span className={s.cardHeading}>{heading}</span>
                <Text asElement="span" className={s.cardText} size={200}>
                  {text}
                </Text>
                {tags && (
                  <span className={s.cardTags}>
                    {tags.map((tag) => {
                      const IconReactSvg = tagIconDict[tag]
                      return <IconReactSvg key={tag} />
                    })}
                  </span>
                )}
              </CardLink>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export type { CardProps }
export default Cards
