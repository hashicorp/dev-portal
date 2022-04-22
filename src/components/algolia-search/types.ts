import { AutocompleteOptions } from '@algolia/autocomplete-core'
import { Hit } from '@algolia/client-search'

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
  getHitLinkProps: (hit: THit) => { href: { pathname: string; href?: string } }
}
