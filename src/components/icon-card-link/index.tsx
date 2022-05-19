import { CSSProperties, ReactNode } from 'react'
import { ProductSlug } from 'types/products'
import CardLink from 'components/card-link'
import s from './icon-card-link.module.css'

interface IconCardLinkProps {
  icon: ReactNode
  text: string
  url: string
  productSlug: ProductSlug
}

const IconCardLink = ({ icon, text, url, productSlug }: IconCardLinkProps) => {
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

export default IconCardLink
