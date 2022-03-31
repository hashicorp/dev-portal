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
  height,
  width,
}: ImageProps): ReactElement {
  /**
   * Warn if there's no intentional alt prop.
   *
   * TODO: determine approach for presentation alt text in MDX
   * Asana: https://app.asana.com/0/1201987349274776/1202042900781423/f
   */
  if (typeof alt !== 'string') {
    console.warn(
      `Warning: Found MDX image with undefined alternate text. Even if an image is decorative, it's important for alt to be set to an empty string. Please define alt text the syntax "![Some alt text.](/some-image.jpg)". Image details: ${JSON.stringify(
        { src, alt, title }
      )}`
    )
  }

  return (
    <div
      className={classNames(s.root, {
        [s.noMargin]: noMargin,
        [s.noBorder]: noBorder,
      })}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={s.img}
        src={src}
        alt={alt}
        title={title}
        height={height}
        width={width}
      />
    </div>
  )
}

export default Image
