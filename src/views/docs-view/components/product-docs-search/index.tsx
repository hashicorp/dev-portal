import React from 'react'
import algoliasearch from 'algoliasearch'
import {
  AutocompleteOptions,
  AutocompleteState,
  createAutocomplete,
} from '@algolia/autocomplete-core'
import { Hit } from '@algolia/client-search'
import {
  getAlgoliaResults,
  parseAlgoliaHitHighlight,
} from '@algolia/autocomplete-preset-algolia'
import { IconCornerDownLeft16 } from '@hashicorp/flight-icons/svg-react/corner-down-left-16'
import { IconSearch16 } from '@hashicorp/flight-icons/svg-react/search-16'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import Badge from 'components/badge'
import s from './product-docs-search.module.css'

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
const searchClient = algoliasearch(appId, apiKey)

type HighlightHitParams<THit> = {
  /**
   * The Algolia hit whose attribute to retrieve the highlighted parts from.
   */
  hit: THit
  /**
   * The attribute to retrieve the highlighted parts from.
   *
   * You can use the array syntax to reference nested attributes.
   */
  attribute: keyof THit | string[]
  /**
   * The tag name to use for highlighted parts.
   *
   * @default "mark"
   */
  tagName?: string
}

export function Highlight<THit>({
  hit,
  attribute,
  tagName = 'mark',
}: HighlightHitParams<THit>): JSX.Element {
  const Element = tagName as keyof JSX.IntrinsicElements

  return (
    <>
      {parseAlgoliaHitHighlight<THit>({ hit, attribute }).map(
        ({ value, isHighlighted }, index) => {
          if (isHighlighted) {
            return <Element key={index}>{value}</Element>
          }

          return value
        }
      )}
    </>
  )
}

function SearchResultsLegend() {
  return (
    <div className={s.legend}>
      <Badge text="↑" /> <Badge text="↓" /> to navigate, <Badge text="ENTER" />{' '}
      to select, <Badge text="ESC" /> to dismiss
    </div>
  )
}

type AutocompleteItem = Hit<{
  page_title: string
  description: string
  objectID: string
}>

function Autocomplete(props: Partial<AutocompleteOptions<AutocompleteItem>>) {
  const [autocompleteState, setAutocompleteState] = React.useState<
    AutocompleteState<AutocompleteItem>
  >({
    collections: [],
    completion: null,
    context: {},
    isOpen: false,
    query: '',
    activeItemId: null,
    status: 'idle',
  })
  const autocomplete = React.useMemo(
    () =>
      createAutocomplete<
        AutocompleteItem,
        React.BaseSyntheticEvent,
        React.MouseEvent,
        React.KeyboardEvent
      >({
        onStateChange({ state }) {
          setAutocompleteState(state)
        },
        ...props,
      }),
    [props]
  )

  const inputRef = React.useRef<HTMLInputElement>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const panelRef = React.useRef<HTMLDivElement>(null)
  const { getEnvironmentProps } = autocomplete

  React.useEffect(() => {
    if (!formRef.current || !panelRef.current || !inputRef.current) {
      return undefined
    }

    const { onTouchStart, onTouchMove } = getEnvironmentProps({
      formElement: formRef.current,
      inputElement: inputRef.current,
      panelElement: panelRef.current,
    })

    window.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchmove', onTouchMove)

    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [getEnvironmentProps, formRef, inputRef, panelRef])

  return (
    <div className={s.root} {...autocomplete.getRootProps({})}>
      <form
        ref={formRef}
        className={s.form}
        {...autocomplete.getFormProps({ inputElement: inputRef.current })}
      >
        <div className={s.inputWrapperPrefix}>
          <label {...autocomplete.getLabelProps({})}>
            <button className={s.submitButton} type="submit" title="Submit">
              <IconSearch16 />
            </button>
          </label>
        </div>
        <div className={s.inputWrapper}>
          <input
            className={s.input}
            ref={inputRef}
            {...autocomplete.getInputProps({ inputElement: inputRef.current })}
          />
        </div>
        <div className={s.inputWrapperSuffix}>
          <button
            className={s.clearButton}
            title="Clear"
            type="reset"
            hidden={!autocompleteState.query}
          >
            <IconX16 />
          </button>
        </div>
      </form>

      {autocompleteState.isOpen && (
        <div
          ref={panelRef}
          className={[
            s.panel,
            'aa-Panel',
            'aa-Panel--desktop',
            autocompleteState.status === 'stalled' && 'aa-Panel--stalled',
          ]
            .filter(Boolean)
            .join(' ')}
          {...autocomplete.getPanelProps({})}
        >
          <div className={s.panelLayout}>
            {autocompleteState.collections.map((collection, index) => {
              const { source, items } = collection

              return (
                <section key={`source-${index}`} className="aa-Source">
                  {items.length > 0 && (
                    <ul className={s.list} {...autocomplete.getListProps()}>
                      {items.map((item) => {
                        return (
                          <li
                            key={item.objectID}
                            className={s.item}
                            {...autocomplete.getItemProps({ item, source })}
                          >
                            <ProductItem hit={item} />
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </section>
              )
            })}
          </div>
          <SearchResultsLegend />
        </div>
      )}
    </div>
  )
}

function ProductItem({ hit }) {
  return (
    <a href={`/waypoint/${hit.objectID}`} className={s.itemLink}>
      <div className={s.itemContent}>
        <div className={s.itemTitle}>
          <Highlight hit={hit} attribute="page_title" />
        </div>
        <div className={s.itemDescription}>
          <Highlight hit={hit} attribute="description" />
          <IconCornerDownLeft16 className={s.enterIcon} />
        </div>
      </div>
    </a>
  )
}

export function ProductDocsSearch() {
  return (
    <Autocomplete
      openOnFocus={true}
      placeholder="Search"
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
        },
      ]}
    />
  )
}
