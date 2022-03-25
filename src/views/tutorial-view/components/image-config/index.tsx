import { Children, isValidElement, ReactElement } from 'react'
import MdxImg from '../mdx-img'
// import classNames from 'classnames'
import s from './image-config.module.css'

// TODO: consider JSX slot rather than string for "caption" prop?
// maybe we wait on this - future enhancement if authors need to include
// links in captions.

/**
 * Configure extra settings for images via MDX.
 * Designed to wrap a single markdown image.
 */
export default function ImageConfig({
  /** Hide borders (temporarily configurable while we remove baked-in borders from existing images) */
  hideBorder = false,
  /** A caption to display below the image. */
  caption = 'This is a test default caption, I just want to see what it looks like.',
  /** An MDX `img`, e.g. `![some alt text](path/to/img.jpg)` */
  children,
}: {
  caption?: string
  hideBorder?: boolean
  children: $TSFixMe
}): ReactElement {
  //  emit a warning if no meaningful props are present
  if (!hideBorder && !caption) {
    console.warn(
      `Warning: <ImageConfig /> was initialized with default props and should be removed`
    )
  }

  //  @TODO: remove `hideBorder` prop + this warning https://app.asana.com/0/0/1200167326263350/f
  if (hideBorder) {
    console.warn(
      `Warning: <ImageConfig /> was initialized with a deprecated prop "hideBorder". Going forward, this property will have no effect. If your image has a border built into it, please crop it to remove it.`
    )
  }
  // Validate that there is exactly one valid child element
  const childCount = Children.count(children)
  const validChildren = Children.toArray(children)
  if (childCount !== 1 || validChildren.length !== 1) {
    throw new Error(
      `In ImageConfig, found ${childCount} total children and ${validChildren.length} valid children. Please ensure that ImageConfig has exactly one child element, and ensure it is a valid image element.`
    )
  }
  // Validate that the child is a ReactElement (not a Fragment or Portal)
  const onlyChild = validChildren[0]
  if (!isValidElement(onlyChild)) {
    throw new Error(
      `In ImageConfig, found child that does not seem to be a valid React element. Please ensure that ImageConfig contains a valid image element.`
    )
  }
  // Validate that the child is a single <p><img /></p> element
  const onlyChildType = onlyChild.props.mdxType || onlyChild.type
  const isChildP = onlyChildType === 'p'
  const nestedChildren = Children.toArray(onlyChild.props.children)
  const isSingleNestedChild = nestedChildren.length == 1
  const nestedChild = nestedChildren[0]
  const isNestedImg =
    isValidElement(nestedChild) &&
    (nestedChild.props.mdxType || nestedChild.type) === 'img'
  if (!isChildP) {
    throw new Error(`Not single child P. Child type: ${onlyChildType}`)
  }
  if (!isSingleNestedChild) {
    throw new Error('Not single nested child.')
  }
  if (!isNestedImg) {
    throw new Error(
      `In ImageConfig, found invalid child "${JSON.stringify(
        onlyChild,
        null,
        2
      )}". Please ensure that ImageConfig contains a single valid image element.`
    )
  }
  // Validate that the { src, alt, title } props are present
  const { src, alt, title } = nestedChild.props
  // Validate that src is present, and is a non-empty string
  if (typeof src !== 'string' || src == '') {
    throw new Error(
      `Images in MDX must have an source defined. Use the format ![some alt text](path/to/img.jpg). Image details: ${JSON.stringify(
        { src, alt, title }
      )} `
    )
  }

  if (caption) {
    // If a caption has been provided, then render an image with a caption
    return (
      <figure className={s.figure}>
        <MdxImg src={src} alt={alt} title={title} noMargin />
        <figcaption className={s.caption}>{caption}</figcaption>
      </figure>
    )
  } else {
    // Otherwise render a plain image tag
    return <MdxImg src={src} alt={alt} title={title} />
  }
}
