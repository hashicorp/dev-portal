import React from 'react'
import {
  AutocompleteOptions,
  AutocompleteState,
  createAutocomplete,
} from '@algolia/autocomplete-core'
import { Hit } from '@algolia/client-search'
import { IconSearch16 } from '@hashicorp/flight-icons/svg-react/search-16'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import { IconSlashSquare16 } from '@hashicorp/flight-icons/svg-react/slash-square-16'
import useFocusOnKeyClick from 'hooks/use-focus-on-key-click'
import SearchResultsLegend from './components/search-results-legend'
import HitWrapper from './components/hit-wrapper'
import { useAlgoliaNavigatorNext } from './lib/use-algolia-navigator-next'

import s from './algolia-search.module.css'

export type AutocompleteProps<THit extends Hit<unknown>> = Partial<
  AutocompleteOptions<THit>
> & {
  /**
   * The component which will accept a Hit object from algolia and render a result
   */
  ResultComponent: React.ComponentType<{ hit: THit }>

  /**
   * Function to derive an object to be passed to next/link as props
   */
  getHitLinkProps: (THit) => { href: { pathname: string; href?: string } }
}

/**
 * Algolia search UI implementation, based on the utilities from @algolia/autocomplete-core
 *
 * We're not using Algolia's fully-baked UI implementation, @algolia/autocomplete-js, as we need
 * to be able to customize all parts of the UI.
 */
export default function AlgoliaSearch<THit extends Hit<unknown>>({
  ResultComponent,
  getHitLinkProps,
  ...props
}: AutocompleteProps<THit>) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const panelRef = React.useRef<HTMLDivElement>(null)

  const navigator = useAlgoliaNavigatorNext<THit>()

  /**
   * Initialize Algolia's autocomplete instance and its state
   */
  const [autocompleteState, setAutocompleteState] = React.useState<
    AutocompleteState<THit>
  >({
    collections: [],
    completion: null,
    context: {},
    isOpen: false,
    query: '',
    activeItemId: null,
    status: 'idle',
  })

  const autocomplete = React.useMemo(() => {
    return createAutocomplete<
      THit,
      React.BaseSyntheticEvent,
      React.MouseEvent,
      React.KeyboardEvent
    >({
      onStateChange({ state }) {
        setAutocompleteState(state)
      },
      navigator,
      ...props,
    })
  }, [])

  /**
   * Initialize event listeners for touch events
   */
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

  /**
   * Allow focusing of the search input on pressing '/'
   */
  useFocusOnKeyClick(inputRef, '/')

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
        <input
          className={s.input}
          ref={inputRef}
          {...autocomplete.getInputProps({ inputElement: inputRef.current })}
        />
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
        {autocompleteState.query ? null : (
          <IconSlashSquare16
            className={s.keyboardHintIcon}
            title="Type '/' to Search"
          />
        )}
      </form>

      {autocompleteState.isOpen && (
        <div
          ref={panelRef}
          className={s.panel}
          {...autocomplete.getPanelProps({})}
        >
          <div className={s.panelLayout}>
            {autocompleteState.collections.map((collection, index) => {
              const { source, items } = collection

              return (
                <section key={`source-${index}`}>
                  {items.length > 0 && (
                    <ul className={s.list} {...autocomplete.getListProps()}>
                      {items.map((item) => {
                        return (
                          <li
                            key={item.objectID}
                            className={s.item}
                            {...autocomplete.getItemProps({ item, source })}
                          >
                            <HitWrapper
                              hit={item}
                              className={s.itemLink}
                              onHitClick={() => {
                                autocomplete.setQuery('')
                              }}
                              getHitLinkProps={getHitLinkProps}
                            >
                              <ResultComponent hit={item} />
                            </HitWrapper>
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

export { Highlight } from './components/highlight'
