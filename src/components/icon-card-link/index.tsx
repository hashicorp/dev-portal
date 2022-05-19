import { CSSProperties } from 'react'
import CardLink from 'components/card-link'
import { IconCardLinkProps } from './types'
import s from './icon-card-link.module.css'

const IconCardLink = ({ icon, productSlug, text, url }: IconCardLinkProps) => {
  let colorToken: string
  if (productSlug === 'sentinel' || productSlug === 'hcp') {
    colorToken = '--token-color-hashicorp-brand'
  } else {
    colorToken = `--token-color-${productSlug}-brand`
  }

  return (
    <CardLink className={s.root} href={url}>
      <span
        className={s.icon}
        style={{ '--icon-color': `var(${colorToken})` } as CSSProperties}
      >
        {icon}
      </span>
      <span className={s.text}>{text}</span>
    </CardLink>
  )
}

export type { IconCardLinkProps }
export default IconCardLink
