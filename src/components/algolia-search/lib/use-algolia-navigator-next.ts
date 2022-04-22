import { AutocompleteOptions } from '@algolia/autocomplete-core'
import { Hit } from '@algolia/client-search'
import { useRouter } from 'next/router'

/**
 * Constructors a [navigator](https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/keyboard-navigation/#reference)
 * instance for use in a Next.js application. Leverages Next's router.
 */
export const useAlgoliaNavigatorNext: <
  THit extends Hit<unknown>
>() => AutocompleteOptions<THit>['navigator'] = () => {
  const router = useRouter()

  return {
    navigate({ itemUrl, state }) {
      router.push({ pathname: itemUrl })
    },
  }
}
