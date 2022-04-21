import { ElementType } from 'react'
import classNames from 'classnames'
import { CardHeadingProps } from './types'
import s from './card-heading.module.css'

function CardHeading({ text, level, screenReaderOnly }: CardHeadingProps) {
  const HeadingElement = `h${level}` as ElementType
  return (
    <HeadingElement
      className={classNames(s.root, screenReaderOnly && 'g-screen-reader-only')}
    >
      {text}
    </HeadingElement>
  )
}

export { CardHeading }
