import { ReactElement, ReactNode } from 'react'
import getValidatedImgChild from './get-validated-image-child'
import Image from 'components/image'
import s from './image-config.module.css'

/**
 * Configure extra settings for images via MDX.
 * Designed to wrap a single markdown image.
 */
export default function ImageConfig({
  /** Hide borders (temporarily configurable while we remove baked-in borders from existing images) */
  hideBorder = false,
  /** A caption to display below the image. */
  caption,
  /** An MDX `img`, e.g. `![some alt text](path/to/img.jpg)` */
  children,
}: {
  caption?: string
  hideBorder?: boolean
  children: ReactNode
}): ReactElement {
  //  emit a warning if no meaningful props are present
  if (!hideBorder && !caption) {
    console.warn(
      `Warning: <ImageConfig /> was initialized with default props. Please remove <ImageConfig /> if configuration is not needed.`
    )
  }

  // TODO: fully deprecate the `hideBorder` prop, then remove this warning
  // Task: https://app.asana.com/0/0/1200167326263350/f
  if (hideBorder) {
    console.warn(
      `Warning: <ImageConfig /> was initialized with a deprecated prop "hideBorder". This property will be deprecated in the near future. If you've provided an image caption, a border will be displayed even if "hideBorder" is set. If your image has a border built into it, please crop it to remove it.`
    )
  }

  const imgElement = getValidatedImgChild(children)
  // Validate that the { src, alt, title } props are present
  const { src, alt, title } = imgElement.props
  // Validate that src is present, and is a non-empty string
  if (typeof src !== 'string' || src == '') {
    throw new Error(
      `Images in MDX must have an source defined. Use the format ![some alt text](path/to/img.jpg). Image details: ${JSON.stringify(
        { src, alt, title }
      )} `
    )
  }

  // TODO: remove this once we're done reviewing
  // (here for now because otherwise, previewing this seemed difficult)
  const TEMP_DEV_CAPTION =
    caption ||
    (src ==
    'https://mktg-content-api-hashicorp.vercel.app/api/assets?product=tutorials&version=main&asset=public%2Fimg%2Fvault%2Fui%2Fvault-ui-intro.png'
      ? 'This is a test default caption, I just want to see what it looks like.'
      : null)

  if (TEMP_DEV_CAPTION) {
    // If a caption has been provided, then render an image with a caption.
    // Note that we ignore the hideBorder prop in this case.
    return (
      <figure className={s.figure}>
        <Image src={src} alt={alt} title={title} noMargin />
        <figcaption className={s.caption}>{TEMP_DEV_CAPTION}</figcaption>
      </figure>
    )
  } else {
    // Otherwise render a plain image tag
    return <Image src={src} alt={alt} title={title} noBorder={hideBorder} />
  }
}
