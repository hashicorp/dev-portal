import { GetStaticPropsResult } from 'next'

/**
 * Given a GetStaticPropsResult,
 * and given an object of props to append to it,
 * return a GetStaticPropsResult which includes the provided props
 * appended to { props }.
 *
 * Note that if the provided GetStaticPropsResult does not have { props }
 * to append to, this function will throw an error.
 */
export function appendStaticProps(
  staticPropsResult: GetStaticPropsResult<{ [key: string]: $TSFixMe }>,
  moreStaticProps: Record<string, unknown>
): GetStaticPropsResult<{ [key: string]: $TSFixMe }> {
  // GetStaticPropsResult is typed such that it may not have any "props",
  // we need to guard against this.
  if (!staticPropsHasProps(staticPropsResult)) {
    throw new Error(
      `appendStaticProps: Missing .props in provided GetStaticPropsResult. Please ensure the provided GetStaticPropsResult has props.`
    )
  }
  // After the above typeguard,
  // we know we have props, so we tack on our landing page content
  return {
    ...staticPropsResult,
    props: { ...staticPropsResult.props, ...moreStaticProps },
  }
}

/**
 * Given an object,
 * assert that it has a .props property that is an object.
 */
function staticPropsHasProps(
  obj: Record<string, unknown>
): obj is Record<string, unknown> & { props: Record<string, unknown> } {
  return (
    obj.props &&
    typeof obj.props === 'object' &&
    obj.props.constructor === Object
  )
}
