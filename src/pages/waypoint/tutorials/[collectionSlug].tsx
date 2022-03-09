/**
 * TODO - create proper view
 */

import {
  getAllCollections,
  getCollection,
} from 'lib/learn-client/api/collection'
import {
  Collection as ClientCollection,
  ProductOption,
} from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import Link from 'next/link'
import { splitProductFromFilename } from 'views/tutorial-view/helpers'

export default function WaypointCollectionPage(props) {
  return (
    <>
      <h1>{props.collection.name}</h1>
      <p>{props.collection.description}</p>
      {/** TODO shape these slugs here, insert collection */}
      <ol>
        {props.collection.tutorials.map((tutorial) => (
          <li key={tutorial.id}>
            <Link href={tutorial.slug}>
              <>
                <a>{tutorial.name}</a> <br />
              </>
            </Link>
          </li>
        ))}
      </ol>
    </>
  )
}

export async function getStaticProps({
  params,
}): Promise<{ props: { collection: ClientCollection } }> {
  const { collectionSlug } = params
  const collection = await getCollection(
    `${ProductOption['waypoint']}/${collectionSlug}`
  )

  return {
    props: {
      collection: stripUndefinedProperties(collection),
    },
  }
}

interface CollectionPagePaths {
  params: {
    collectionSlug: string
  }
}

export async function getStaticPaths(): Promise<{
  paths: CollectionPagePaths[]
  fallback: boolean
}> {
  const collections = await getAllCollections({
    product: ProductOption['waypoint'],
  })
  const paths = collections.map((collection) => ({
    params: {
      collectionSlug: splitProductFromFilename(collection.slug),
    },
  }))
  return {
    paths,
    fallback: false,
  }
}
