import { useCallback, useMemo } from 'react'
import algoliasearch from 'algoliasearch'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ProductSlug } from 'types/products'
import { productSlugs, productSlugsToNames } from 'lib/products'
import { useCurrentProduct } from 'contexts'
import { CommandBarTag, useCommandBar } from 'components/command-bar'
import { useSetUpAndCleanUpCommandState } from 'components/command-bar/hooks'
import {
	CommandBarLinkListItem,
	CommandBarList,
} from 'components/command-bar/components'
import Tabs, { Tab } from 'components/tabs'
import { generateSuggestedPages } from './helpers/generate-suggested-pages'
import SuggestedPages, { SuggestedPage } from './suggested-pages'

// TODO(brkalow): We might consider lazy-loading the search client & the insights library
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
const searchClient = algoliasearch(appId, apiKey)

const SearchCommandBarDialogBody = () => {
	const { addTag, currentInputValue, currentTags, removeTag } = useCommandBar()
	const currentProduct = useCurrentProduct()

	/**
	 * Generate suggested pages, memoized.
	 *
	 * NOTE: Can probably still be optimized by doing this in Command Bar, but
	 * waiting to abstract that far for now.
	 */
	const suggestedPages = useMemo<SuggestedPage[]>(() => {
		const currentProductTag = currentProduct
			? currentTags.find((tag: CommandBarTag) => tag.id === currentProduct.slug)
			: undefined
		return generateSuggestedPages(currentProductTag?.id as ProductSlug)
	}, [currentProduct, currentTags])

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
				<Tabs>
					<Tab heading="Documentation">
						{searchResults && searchResults.docs.length > 0 ? (
							<>
								<div
									id="documentation-search-results-label"
									className="g-screen-reader-only"
								>
									Documentation search results
								</div>
								<CommandBarList ariaLabelledBy="documentation-search-results-label">
									{searchResults.docs.map((hit) => {
										const { objectID, _highlightResult, product } = hit
										const { page_title, description } = _highlightResult
										const resultUrl = `/${product}/${objectID}`
										const productName =
											product === 'hcp' ? 'HCP' : productSlugsToNames[product]

										return (
											<CommandBarLinkListItem
												key={objectID}
												title={page_title?.value}
												description={description?.value}
												url={resultUrl}
												badges={[productName]}
											/>
										)
									})}
								</CommandBarList>
							</>
						) : (
							'No docs results'
						)}
					</Tab>
					<Tab heading="Tutorials">
						{searchResults && searchResults.tutorials.length > 0 ? (
							<>
								<div
									id="tutorials-search-results-label"
									className="g-screen-reader-only"
								>
									Tutorials search results
								</div>
								<CommandBarList ariaLabelledBy="tabs-search-results-label">
									{searchResults.tutorials.map((hit) => {
										const { _highlightResult, id, products } = hit
										const { name, description } = _highlightResult
										const badges = products?.map(
											(productSlug) => productSlugsToNames[productSlug]
										)
										const [productSlug, collectionSlug] =
											hit.defaultContext.slug.split('/')
										const [, tutorialSlug] = hit.slug.split('/')
										const resultUrl = `/${
											productSlug === 'cloud' ? 'hcp' : productSlug
										}/tutorials/${collectionSlug}/${tutorialSlug}`

										return (
											<CommandBarLinkListItem
												key={id}
												title={name?.value}
												description={description?.value}
												url={resultUrl}
												badges={badges}
											/>
										)
									})}
								</CommandBarList>
							</>
						) : (
							'No tutorials results'
						)}
					</Tab>
				</Tabs>
			) : (
				<SuggestedPages pages={suggestedPages} />
			)}
		</>
	)
}

export default SearchCommandBarDialogBody
