import React, { createElement, Fragment, useEffect, useRef } from 'react'
import { render } from 'react-dom'
import algoliasearch from 'algoliasearch'
import { autocomplete } from '@algolia/autocomplete-js'
import { getAlgoliaResults } from '@algolia/autocomplete-js'
import { IconCornerDownLeft16 } from '@hashicorp/flight-icons/svg-react/corner-down-left-16'
import Badge from 'components/badge'
import s from './product-docs-search.module.css'

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
const searchClient = algoliasearch(appId, apiKey)

function SearchResultsLegend() {
  return (
    <div className={s.legend}>
      <Badge text="↑" /> <Badge text="↓" /> to navigate, <Badge text="ENTER" />{' '}
      to select, <Badge text="ESC" /> to dismiss
    </div>
  )
}

function Autocomplete(
  props: Omit<Parameters<typeof autocomplete>[0], 'container'>
) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) {
      return undefined
    }

    const search = autocomplete({
      container: containerRef.current,
      renderer: {
        createElement,
        Fragment,
        // @ts-expect-error - react-dom type mismatch, but matching the documentation
        render,
      },
      render({ sections }, root) {
        render(
          <>
            <div className={s.panelLayout}>{sections}</div>
            <SearchResultsLegend />
          </>,
          root
        )
      },
      ...props,
    })

    return () => {
      search.destroy()
    }
  }, [props])

  return <div ref={containerRef} />
}

function ProductItem({ hit, components }) {
  return (
    <a href={`/waypoint/${hit.objectID}`} className={s.itemLink}>
      <div className={s.itemContent}>
        <div className={s.itemTitle}>
          <components.Highlight hit={hit} attribute="page_title" />
        </div>
        <div className={s.itemDescription}>
          <components.Highlight hit={hit} attribute="description" />
          <IconCornerDownLeft16 className={s.enterIcon} />
        </div>
      </div>
    </a>
  )
}

export function ProductDocsSearch() {
  return (
    <Autocomplete
      onStateChange={console.log}
      classNames={{
        root: s.root,
        form: s.form,
        inputWrapperPrefix: s.inputWrapperPrefix,
        submitButton: s.submitButton,
        inputWrapper: s.inputWrapper,
        input: s.input,
        inputWrapperSuffix: s.inputWrapperSuffix,
        clearButton: s.clearButton,
        panel: s.panel,
        panelLayout: s.panelLayout,
        list: s.list,
        item: s.item,
      }}
      openOnFocus={true}
      placeholder="Search"
      debug
      detachedMediaQuery="none"
      getSources={({ query }) => [
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
              ],
            })
          },
          templates: {
            item({ item, components }) {
              return <ProductItem hit={item} components={components} />
            },
          },
        },
      ]}
    />
  )
}
