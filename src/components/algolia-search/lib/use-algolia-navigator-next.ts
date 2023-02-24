/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { AutocompleteOptions } from '@algolia/autocomplete-core'
import { Hit } from '@algolia/client-search'
import { useRouter } from 'next/router'

/**
 * Constructs a [navigator](https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/keyboard-navigation/#reference)
 * instance for use in a Next.js application. Leverages Next's router.
 */
export const useAlgoliaNavigatorNext: <
	THit extends Hit<unknown>
>() => AutocompleteOptions<THit>['navigator'] = () => {
	const router = useRouter()

	return {
		navigate({ itemUrl }) {
			router.push(itemUrl)
		},
	}
}
