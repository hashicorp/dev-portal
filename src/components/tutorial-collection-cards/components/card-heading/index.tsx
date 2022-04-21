import { ElementType } from 'react'
import classNames from 'classnames'
import { CardHeadingProps } from './types'
import CompanyLogo from './company-logo'
import s from './card-heading.module.css'

function CardHeading({ text, level, logo }: CardHeadingProps) {
  const hasLogo = Boolean(logo)
  const HeadingElement = `h${level}` as ElementType
  return (
    <HeadingElement className={classNames(s.root, { [s.hasLogo]: hasLogo })}>
      <span className={classNames(hasLogo && 'g-screen-reader-only')}>
        {text}
      </span>
      {/* Note: logo is used by CollectionCard */}
      {hasLogo && (
        <span className={s.logo}>
          <CompanyLogo name={logo} />
        </span>
      )}
    </HeadingElement>
  )
}

export { CardHeading }
