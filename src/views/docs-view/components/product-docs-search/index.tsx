import React from 'react'
import algoliasearch from 'algoliasearch'
import { Hit } from '@algolia/client-search'
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia'
import { IconCornerDownLeft16 } from '@hashicorp/flight-icons/svg-react/corner-down-left-16'
import s from './product-docs-search.module.css'
import { AlgoliaSearch } from './algolia-search'
import { Highlight } from './highlight'
import { useCurrentProduct } from 'contexts'

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
const searchClient = algoliasearch(appId, apiKey)

function ProductSearchResult({
  hit,
}: {
  hit: Hit<{
    page_title: string
    description: string
    _tags: string[]
    __autocomplete_indexName: string
  }>
}) {
  const product = useCurrentProduct()

  return (
    <a href={`/${product.slug}/${hit.objectID}`} className={s.itemLink}>
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

export default function ProductDocsSearch() {
  const currentProduct = useCurrentProduct()

  return (
    // TODO(brkalow): setup analytics integration
    <AlgoliaSearch
      openOnFocus={true}
      placeholder={`Search ${currentProduct.slug} documentation`}
      ResultComponent={ProductSearchResult}
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
                    indexName: currentProduct.algoliaConfig.indexName,
                    query,
                    params: {
                      clickAnalytics: true,
                      hitsPerPage: 25,
                    },
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
