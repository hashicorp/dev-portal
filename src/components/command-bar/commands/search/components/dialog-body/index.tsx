import { useCallback, useMemo } from 'react'
import algoliasearch from 'algoliasearch'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ProductSlug } from 'types/products'
import { productSlugs } from 'lib/products'
import { useCurrentContentType, useCurrentProduct } from 'contexts'
import { useCommandBar } from 'components/command-bar'
import { useSetUpAndCleanUpCommandState } from 'components/command-bar/hooks'
import Tabs, { Tab } from 'components/tabs'
import { generateSuggestedPages } from '../../helpers/generate-suggested-pages'
import SuggestedPages, { SuggestedPage } from '../../suggested-pages'
import { getCurrentProductTag } from '../../helpers/get-current-product-tag'
import DocumentationTabContents from '../documentation-tab-contents'
import TutorialsTabContents from '../tutorials-tab-contents'

// TODO(brkalow): We might consider lazy-loading the search client & the insights library
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
const searchClient = algoliasearch(appId, apiKey)

const SearchCommandBarDialogBody = () => {
	const { addTag, currentInputValue, currentTags, removeTag } = useCommandBar()
	const currentProduct = useCurrentProduct()
	const contentType = useCurrentContentType()

	/**
	 * Get the CommandBarTag object for the current product if it's present.
	 */

	const currentProductTag = useMemo(
		() =>
			getCurrentProductTag({
				currentProduct,
				currentTags,
			}),
		[currentProduct, currentTags]
	)

	/**
	 * Generate suggested pages, memoized.
	 *
	 * NOTE: Can probably still be optimized by doing this in Command Bar, but
	 * waiting to abstract that far for now.
	 */
	const suggestedPages = useMemo<SuggestedPage[]>(() => {
		return generateSuggestedPages(currentProductTag?.id as ProductSlug)
	}, [currentProductTag])

	/**
	 * Create callback for setting up this command's state.
	 */
	const setUpCommandState = useCallback(() => {
		if (currentProduct) {
			addTag({ id: currentProduct.slug, text: currentProduct.name })
		}
	}, [addTag, currentProduct])

	/**
	 * Create callback for cleaning up this command's state.
	 */
	const cleanUpCommandState = useCallback(() => {
		if (currentProduct) {
			removeTag(currentProduct.slug)
		}
	}, [currentProduct, removeTag])

	/**
	 * Leveraging the set up + clean up hook exposed by CommandBarDialog.
	 */
	useSetUpAndCleanUpCommandState(setUpCommandState, cleanUpCommandState)

	/**
	 * Using React Query helps us cache results by query key so we don't have to
	 * worry about handling different query requests coming back in a different
	 * order than we invoked them.
	 */
	useQuery(['search', currentInputValue], () => {
		if (!currentInputValue) {
			return { docs: [], tutorials: [] }
		}

		return searchClient
			.multipleQueries([
				...productSlugs
					.filter((slug) => slug !== 'sentinel')
					.map((slug) => ({
						indexName: `product_${slug.toUpperCase()}`,
						query: currentInputValue,
					})),
				{
					indexName: 'prod_LEARN',
					query: currentInputValue,
				},
			])
			.then(({ results }) => {
				let tutorialsResults = []
				let docsResults = []

				results.forEach(({ hits, index }) => {
					if (hits.length <= 0) {
						return
					}

					if (index === 'prod_LEARN') {
						tutorialsResults = tutorialsResults.concat(hits)
					} else {
						// Have to set `product` for some products, like`hcp`. Otherwise it's `undefined`.
						const productSlug = index.slice('product_'.length).toLowerCase()
						docsResults = docsResults.concat(
							hits.map((hit) => ({
								...hit,
								product: productSlug,
							}))
						)
					}
				})

				return { docs: docsResults, tutorials: tutorialsResults }
			})
	})

	/**
	 * Getting the query data by the query key to avoid rendering the data from
	 * the last-resolved query request.
	 */
	const queryClient = useQueryClient()
	const searchResults: { docs: $TSFixMe[]; tutorials: $TSFixMe[] } =
		queryClient.getQueryData(['search', currentInputValue])

	return (
		<>
			{currentInputValue ? (
				<Tabs
					showAnchorLine={false}
					initialActiveIndex={contentType === 'tutorials' ? 1 : 0}
				>
					<Tab heading="Documentation">
						<DocumentationTabContents
							searchResults={searchResults ? searchResults.docs : []}
							suggestedPages={suggestedPages}
						/>
					</Tab>
					<Tab heading="Tutorials">
						<TutorialsTabContents
							searchResults={searchResults ? searchResults.tutorials : []}
							tutorialLibraryCta={{
								href: currentProductTag
									? `/tutorials/library?product=${currentProductTag.id}`
									: '/tutorials/library',
								text: currentProductTag
									? `See all ${currentProductTag.text} tutorials in the Tutorial Library`
									: 'See all tutorials in the Tutorial Library',
							}}
						/>
					</Tab>
				</Tabs>
			) : (
				<SuggestedPages pages={suggestedPages} />
			)}
		</>
	)
}

export default SearchCommandBarDialogBody
