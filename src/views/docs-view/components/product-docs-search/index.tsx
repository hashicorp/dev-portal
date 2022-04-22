import React from 'react'
import algoliasearch from 'algoliasearch'
import { Hit } from '@algolia/client-search'
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia'
import { IconCornerDownLeft16 } from '@hashicorp/flight-icons/svg-react/corner-down-left-16'
import s from './product-docs-search.module.css'
import { AlgoliaSearch } from './algolia-search'
import { Highlight } from './highlight'

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
const searchClient = algoliasearch(appId, apiKey)

function ProductItem({
  hit,
}: {
  hit: Hit<{
    page_title: string
    description: string
    _tags: string[]
    __autocomplete_indexName: string
  }>
}) {
  return (
    <a href={`/waypoint/${hit.objectID}`} className={s.itemLink}>
      <div className={s.itemContent}>
        <div className={s.itemTitle}>
          <Highlight hit={hit} attribute="page_title" />
        </div>
        <div className={s.itemDescription}>
          <Highlight hit={hit} attribute="description" />
        </div>
        <IconCornerDownLeft16 className={s.enterIcon} />
      </div>
    </a>
  )
}

export function ProductDocsSearch() {
  return (
    <AlgoliaSearch
      openOnFocus={true}
      placeholder="Search"
      ResultComponent={ProductItem}
      getSources={({ query }) => {
        if (!query) {
          return []
        }

        return [
          {
            sourceId: 'products',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: 'product_WAYPOINT',
                    query,
                  },
                  // TODO(brkalow): add additional queries to support cross-product?
                  // {
                  //   indexName: 'product_VAULT',
                  //   query,
                  // },
                ],
              })
            },
          },
        ]
      }}
    />
  )
}
