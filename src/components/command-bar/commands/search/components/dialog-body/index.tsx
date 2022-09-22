import { useCallback, useMemo } from 'react'
import algoliasearch from 'algoliasearch'
import { ProductSlug } from 'types/products'
import { productSlugs, productSlugsToNames } from 'lib/products'
import { useCurrentContentType, useCurrentProduct } from 'contexts'
import { useCommandBar } from 'components/command-bar'
import { useSetUpAndCleanUpCommandState } from 'components/command-bar/hooks'
import Tabs, { Tab } from 'components/tabs'
import { generateSuggestedPages } from '../../helpers/generate-suggested-pages'
import SuggestedPages, { SuggestedPage } from '../../suggested-pages'
import { getCurrentProductTag } from '../../helpers/get-current-product-tag'

import {
	Configure,
	Index,
	InstantSearch,
	useHits,
} from 'react-instantsearch-hooks-web'
import {
	CommandBarLinkListItem,
	CommandBarList,
} from 'components/command-bar/components'

// TODO(brkalow): We might consider lazy-loading the search client & the insights library
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
const searchClient = algoliasearch(appId, apiKey)

const DocumentationHit = ({ hit, index }) => {
	const {
		objectID,
		_highlightResult,
		product = index.slice('product_'.length).toLowerCase(),
	} = hit
	const { page_title, description } = _highlightResult
	const resultUrl = `/${product}/${objectID}`
	const productName = product === 'hcp' ? 'HCP' : productSlugsToNames[product]

	return (
		<CommandBarLinkListItem
			key={objectID}
			title={page_title?.value}
			description={description?.value}
			url={resultUrl}
			badges={[productName]}
		/>
	)
}

const TutorialHit = ({ hit }) => {
	const { _highlightResult, id, products } = hit
	const { name, description } = _highlightResult
	const badges = products?.map(
		(productSlug) => productSlugsToNames[productSlug]
	)
	const [productSlug, collectionSlug] = hit.defaultContext.slug.split('/')
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
}

const CustomHits = ({ type }) => {
	const {
		hits,
		results: { index },
	} = useHits()

	if (hits && hits.length <= 0) {
		return null
	}

	const labelElementId = `${type}-search-results-label`
	return (
		<>
			<div id={labelElementId} className="g-screen-reader-only">
				{type} search results
			</div>
			<CommandBarList ariaLabelledBy={labelElementId}>
				{hits.map((hit) => {
					if (type === 'documentation') {
						return (
							<DocumentationHit key={hit.objectID} hit={hit} index={index} />
						)
					}

					if (type === 'tutorials') {
						return <TutorialHit key={hit.objectID} hit={hit} />
					}
				})}
			</CommandBarList>
		</>
	)
}

const DocumentationTabContents = () => {
	return (
		<>
			{productSlugs
				.filter((slug) => slug !== 'sentinel')
				.map((slug) => (
					<Index key={slug} indexName={`product_${slug.toUpperCase()}`}>
						<CustomHits type="documentation" />
					</Index>
				))}
		</>
	)
}

const TutorialsTabContents = () => {
	return (
		<Index indexName="prod_LEARN">
			<CustomHits type="tutorials" />
		</Index>
	)
}

const SearchCommandBarDialogBodyContent = () => {
	const currentProduct = useCurrentProduct()
	const contentType = useCurrentContentType()
	const { addTag, currentInputValue, currentTags, removeTag } = useCommandBar()

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

	return (
		<>
			{currentInputValue ? (
				<Tabs
					showAnchorLine={false}
					initialActiveIndex={contentType === 'tutorials' ? 1 : 0}
				>
					<Tab heading="Documentation">
						<DocumentationTabContents />
					</Tab>
					<Tab heading="Tutorials">
						<TutorialsTabContents />
					</Tab>
				</Tabs>
			) : (
				<SuggestedPages pages={suggestedPages} />
			)}
		</>
	)
}

const SearchCommandBarDialogBody = () => {
	const { currentInputValue } = useCommandBar()

	return (
		<InstantSearch indexName="prod_LEARN" searchClient={searchClient}>
			<Configure query={currentInputValue} />
			<SearchCommandBarDialogBodyContent />
		</InstantSearch>
	)
}

export default SearchCommandBarDialogBody
