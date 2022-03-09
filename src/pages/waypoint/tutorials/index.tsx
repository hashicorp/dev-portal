/**
 * TODO create proper view
 */

import Link from 'next/link'

export default function ProductTutorialHubPage() {
  return (
    <>
      <h1>Waypoint Tutorials</h1>
      <Link href="/waypoint/tutorials/get-started-docker">
        <a>See this collection</a>
      </Link>
    </>
  )
}
