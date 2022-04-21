import { Children, isValidElement, ReactElement, ReactNode } from 'react'

/**
 * Given the incoming children passed to `<ImageConfig />`,
 * validate that the children are in the expected structure.
 *
 * Return the child `<img />` element if the structure is expected,
 * throw an error otherwise.
 */
function getValidatedImgChild(children: ReactNode): ReactElement {
  // Validate that there is exactly one child element
  const childCount = Children.count(children)
  const validChildren = Children.toArray(children)
  if (childCount !== 1 || validChildren.length !== 1) {
    warnInDev(
      `In ImageConfig, found ${childCount} total children and ${validChildren.length} valid children. Please ensure that ImageConfig has exactly one child element, and ensure it is a valid image element.`
    )
  }

  // Validate that the child is a ReactElement
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
  if (isChildImg) {
    // If the only child is <img>, that's great, return it.
    return onlyChild
  } else if (isChildP) {
    // If the only child is <p>, validate and return a single nested <img>.
    return getImgChild(onlyChild)
  } else {
    // Otherwise throw an error, this is an unexpected structure
    warnInDev(
      `In ImageConfig, found child with unexpected type: "${onlyChildType}". Please ensure that ImageConfig contains a single <img /> element. Child element details: ${JSON.stringify(
        onlyChild,
        null,
        2
      )}`
    )
  }
}

/**
 * Given a paragraph element expected to be wrapping an <img>
 * return the image element only.
 *
 * Throw an error if the elements are not structured as expected.
 */
function getImgChild(pChild: ReactElement) {
  const nestedChildren = Children.toArray(pChild.props.children)
  const isSingleNestedChild = nestedChildren.length == 1
  const nestedChild = nestedChildren[0]
  const isNestedImg =
    isValidElement(nestedChild) &&
    (nestedChild.props.mdxType || nestedChild.type) === 'img'
  if (!isSingleNestedChild || !isNestedImg) {
    warnInDev(
      `In ImageConfig, found an unexpected element nested in the expected <p/> tag. Please ensure that ImageConfig contains a single <img /> element. Child element details: ${JSON.stringify(
        pChild,
        null,
        2
      )}`
    )
  }
  if (!isValidElement(nestedChild)) {
    throw new Error(
      `In ImageConfig, found nested child that does not seem to be a valid React element. Please ensure that ImageConfig contains a valid image element.`
    )
  }
  return nestedChild
}

const IS_DEV = process.env.NODE_ENV !== 'production'
/**
 * Given an error message,
 * silently ignore the message if we're in production,
 * or warn if we're in a development environment.
 *
 * TODO: we likely want to fix all content issues at the source,
 * and throw an error here rather than warn. Asana task:
 * https://app.asana.com/0/1202097197789424/1202163585099211/f
 */
function warnInDev(message: string) {
  if (IS_DEV) {
    console.warn(message)
  }
}

export default getValidatedImgChild
