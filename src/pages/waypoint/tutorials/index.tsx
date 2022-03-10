/**
 * TODO create proper view
 */

import { getAllCollections } from 'lib/learn-client/api/collection'
import {
  Collection as ClientCollection,
  ProductOption,
} from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import Link from 'next/link'

export default function WaypointTutorialHubPage() {
  return (
    <>
      <h1>Waypoint Tutorials</h1>
      <h2>All Collections</h2>
      <Link href="/waypoint/tutorials/get-started-docker">
        <a>See this collection</a>
      </Link>
    </>
  )
}

export async function getStaticProps(): Promise<{
  props: { collections: ClientCollection[] }
}> {
  // also call product, incorporate this into the client, to get description etc.
  const collections = await getAllCollections({
    product: ProductOption['waypoint'],
  })

  return {
    props: {
      collections: stripUndefinedProperties(collections),
    },
  }
}
