/**
 * TODO - create proper view
 */

import Link from 'next/link'

export default function CollectionPage() {
  return (
    <>
      <h1>Collection Heading</h1>
      <Link href="/get-started-intro">
        <a>Go to this tutorial</a>
      </Link>
    </>
  )
}
