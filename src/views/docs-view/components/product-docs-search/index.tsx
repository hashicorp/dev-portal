import React from 'react'
import algoliasearch from 'algoliasearch'
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia'
import { IconCornerDownLeft16 } from '@hashicorp/flight-icons/svg-react/corner-down-left-16'
import AlgoliaSearch, { Highlight } from 'components/algolia-search'
import { useCurrentProduct } from 'contexts'
import { getHitLink } from './lib/get-hit-link'
import s from './product-docs-search.module.css'
import { DocsSearchHit } from './types'

// TODO(brkalow): We might consider lazy-loading the search client
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
const searchClient = algoliasearch(appId, apiKey)

function ProductSearchResult({ hit }: { hit: DocsSearchHit }) {
  return (
    <div className={s.itemContent}>
      <div className={s.itemTitle}>
        <Highlight hit={hit} attribute="page_title" />
      </div>
      <div className={s.itemDescription}>
        <Highlight hit={hit} attribute="description" />
      </div>
      <IconCornerDownLeft16 className={s.enterIcon} />
    </div>
  )
}

export default function ProductDocsSearch() {
  const currentProduct = useCurrentProduct()

  return (
    // TODO(brkalow): setup analytics integration
    <AlgoliaSearch
      debug
      openOnFocus={true}
      placeholder={`Search ${currentProduct.slug} documentation`}
      ResultComponent={ProductSearchResult}
      getHitLinkProps={getHitLink}
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
            /**
             * This enables press-enter-to-navigate while an item is active via keyboard navigation,
             * it is passed along to algolia's autocomplete library which handles setting up the handler
             * internally.
             *
             * ref: https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/keyboard-navigation
             */
            getItemUrl({ item }) {
              const { href } = getHitLink(item)

              return `${href.pathname}${href.hash ? `#${href.hash}` : ''}`
            },
          },
        ]
      }}
    />
  )
}
