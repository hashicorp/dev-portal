import { Children, isValidElement, ReactElement, ReactNode } from 'react'
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
        <MdxImg src={src} alt={alt} title={title} noMargin />
        <figcaption className={s.caption}>{TEMP_DEV_CAPTION}</figcaption>
      </figure>
    )
  } else {
    // Otherwise render a plain image tag
    return <MdxImg src={src} alt={alt} title={title} noBorder={hideBorder} />
  }
}

/**
 * Given the incoming children passed to <ImageConfig />,
 * validate that the children are in the expected structure.
 *
 * Return the child <img /> element if the structure is expected,
 * throw an error otherwise.
 */
function getValidatedImgChild(children: ReactNode) {
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
  // Validate that the child is either:
  // 1. a single <p><img /></p> -- expected in markdown use, ie ![](/img.jpg)
  // 2. a single <img /> -- expected when using an <img /> HTML tag
  const onlyChildType = onlyChild.props.mdxType || onlyChild.type
  const isChildImg = onlyChildType === 'img'
  const isChildP = onlyChildType === 'p'
  const isValidChild = isChildP || isChildImg
  if (!isValidChild) {
    throw new Error(
      `In ImageConfig, found child with unexpected type: "${onlyChildType}". Please ensure that ImageConfig contains a single <img /> element. Child element details: ${JSON.stringify(
        onlyChild,
        null,
        2
      )}`
    )
  }
  // If child is <p>, validate that it has a single nested <img> element
  const nestedChildren = Children.toArray(onlyChild.props.children)
  if (isChildP) {
    const isSingleNestedChild = nestedChildren.length == 1
    const nestedChild = nestedChildren[0]
    const isNestedImg =
      isValidElement(nestedChild) &&
      (nestedChild.props.mdxType || nestedChild.type) === 'img'
    if (!isSingleNestedChild || !isNestedImg) {
      throw new Error(
        `In ImageConfig, found an unexpected element nested in the expected <p/> tag. Please ensure that ImageConfig contains a single <img /> element. Child element details: ${JSON.stringify(
          onlyChild,
          null,
          2
        )}`
      )
    }
    return nestedChild
  } else {
    return onlyChild
  }
}
