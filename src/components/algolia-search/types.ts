import { AutocompleteOptions } from '@algolia/autocomplete-core'
import { Hit } from '@algolia/client-search'

export type AlgoliaSearchPops<THit extends Hit<unknown>> = Partial<
	AutocompleteOptions<THit>
> & {
	/**
	 * The component which will accept a Hit object from algolia and render a result
	 */
	ResultComponent: React.ComponentType<{ hit: THit }>

	/**
	 * Function to derive an object to be passed to components/link as props
	 */
	getHitLinkProps: (THit) => { href: { pathname: string; href?: string } }

	/**
	 * Class to be applied to the top-level element
	 */
	className?: string
}
