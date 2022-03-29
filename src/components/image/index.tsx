import { ReactElement } from 'react'
import { ImageProps } from './types'
import classNames from 'classnames'
import s from './image.module.css'

/**
 * An Image component for use in MDX
 */
function Image({
  src,
  alt,
  title,
  noMargin,
  noBorder,
}: ImageProps): ReactElement {
  return (
    <div
      className={classNames(s.root, {
        [s.noMargin]: noMargin,
        [s.noBorder]: noBorder,
      })}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.img} src={src} alt={alt} title={title} />
    </div>
  )
}

export default Image
