import { IconCornerDownLeft16 } from '@hashicorp/flight-icons/svg-react/corner-down-left-16'
import {
  BaseSyntheticEvent,
  MouseEvent,
  KeyboardEvent,
  useState,
  forwardRef,
  Fragment,
  MutableRefObject,
  ForwardedRef,
} from 'react'
import { Hit } from '@algolia/client-search'
import {
  AutocompleteApi,
  AutocompleteCollection,
} from '@algolia/autocomplete-core'
import { useDeviceSize } from 'contexts'
import Portal from 'components/portal'
import Text from 'components/text'
import useSafeLayoutEffect from 'hooks/use-safe-layout-effect'
import { useNoScrollBody } from 'hooks/use-no-scroll-body'
import HitWrapper from './hit-wrapper'
import { AlgoliaSearchPops } from '../types'
import { useHasResults } from '../lib/use-has-results'
import SearchResultsLegend from './search-results-legend'
import s from '../algolia-search.module.css'

type PanelProps<THit extends Hit<unknown>> = {
  /**
   * The autocomplete instance, generated by calling createAutoComplete from `@algolia/autocomplete-core`
   */
  autocomplete: AutocompleteApi<
    THit,
    BaseSyntheticEvent,
    MouseEvent,
    KeyboardEvent
  >

  /**
   * The collections returned from an algolia search query, used to render the results
   */
  collections: AutocompleteCollection<THit>[]

  /**
   * The component type used to render each individual search result
   */
  ResultComponent: AlgoliaSearchPops<THit>['ResultComponent']

  /**
   * Getter function for the props to pass to each result's Link wrapper
   */
  getHitLinkProps: AlgoliaSearchPops<THit>['getHitLinkProps']

  /**
   * Ref to the form element wrapping the search input. Used to determine position
   * of the panel element for mobile viewports.
   */
  formRef: MutableRefObject<HTMLFormElement>
}

/**
 * Handles rendering of the search hits panel for desktop or mobile viewports. For desktop,
 * the panel is rendered inline next to the search form. On mobile, the panel is rendered into
 * a portal and is styled to take up the entire screen below the search input.
 *
 * A ref passed to `Panel` is attached to the panel's inner element, but NOT the portal container.
 */
export default forwardRef(function Panel<THit extends Hit<unknown>>(
  {
    autocomplete,
    collections,
    ResultComponent,
    getHitLinkProps,
    formRef,
  }: PanelProps<THit>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const { isDesktop } = useDeviceSize()
  const [panelPositionStyle, setPanelPositionStyle] = useState({})
  const hasResults = useHasResults(collections)
  /**
   * Compute styles for panel position on mobile viewports.
   */
  useSafeLayoutEffect(() => {
    if (!formRef.current || isDesktop) {
      return
    }

    const rect = formRef.current.getBoundingClientRect()

    const positionStyle = {
      top: rect.bottom + window.scrollY,
      bottom: 0,
    }

    setPanelPositionStyle(positionStyle)
  }, [])

  /**
   * Ensures the body can't be scrolled while the search panel is open on mobile viewports.
   */
  useNoScrollBody(!isDesktop)

  const Wrapper = isDesktop ? Fragment : Portal

  return (
    <Wrapper>
      <div
        ref={ref}
        className={s.panel}
        {...autocomplete.getPanelProps({})}
        style={panelPositionStyle}
      >
        <div className={s.panelLayout}>
          {hasResults ? (
            collections.map((collection, index) => {
              const { source, items } = collection
              return (
                <section key={`source-${index}`}>
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
                            <IconCornerDownLeft16 className={s.enterIcon} />
                          </HitWrapper>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              )
            })
          ) : (
            <div className={s.noResults}>
              <Text weight="semibold" size={200}>
                No Results
              </Text>
              <Text className={s.noResultsDescription} size={200}>
                Search tips: some terms require an exact match. Try typing the
                entire term, or use a different word or phrase.
              </Text>
            </div>
          )}
        </div>
        {isDesktop && <SearchResultsLegend />}
      </div>
    </Wrapper>
  )
})
