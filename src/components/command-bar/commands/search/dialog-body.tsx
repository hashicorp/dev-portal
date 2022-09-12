import { useCallback, useMemo, useState } from 'react'
import { IconGuide16 } from '@hashicorp/flight-icons/svg-react/guide-16'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { ProductSlug } from 'types/products'
import { useCurrentContentType, useCurrentProduct } from 'contexts'
import Card from 'components/card'
import { useCommandBar } from 'components/command-bar'
import { useSetUpAndCleanUpCommandState } from 'components/command-bar/hooks'
import { CommandBarDivider } from 'components/command-bar/components'
import StandaloneLink from 'components/standalone-link'
import Tabs, { Tab } from 'components/tabs'
import { generateSuggestedPages } from './helpers/generate-suggested-pages'
import SuggestedPages, { SuggestedPage } from './suggested-pages'
import s from './dialog-body.module.css'
import Text from 'components/text'
import { getCurrentProductTag } from './helpers/get-current-product-tag'

const DEFAULT_SEARCH_RESULTS = {
	docs: [],
	tutorials: [],
}

const NoResultsMessage = () => {
	return <p className={s.noResultsMessage}>No results match your search.</p>
}

const DocumentationTabContents = ({ searchResults, suggestedPages }) => {
	return searchResults.length === 0 ? (
		<>
			<NoResultsMessage />
			<CommandBarDivider className={s.noDocsResultsDivider} />
			<SuggestedPages pages={suggestedPages} />
		</>
	) : (
		<p>TODO show docs results</p>
	)
}

const TutorialsTabContents = ({ searchResults, tutorialLibraryCta }) => {
	return searchResults.length === 0 ? (
		<>
			<NoResultsMessage />
			<Card className={s.tutorialLibraryCta} elevation="base">
				<IconGuide16 className={s.tutorialLibraryCtaIcon} />
				<Text
					asElement="span"
					className={s.tutorialLibraryCtaText}
					size={200}
					weight="medium"
				>
					{tutorialLibraryCta.text}
				</Text>
				<StandaloneLink
					href={tutorialLibraryCta.href}
					icon={<IconArrowRight16 />}
					iconPosition="trailing"
					size="small"
					text="Explore"
				/>
			</Card>
		</>
	) : (
		<p>TODO show tutorials results</p>
	)
}

const SearchCommandBarDialogBody = () => {
	const { addTag, currentInputValue, currentTags, removeTag } = useCommandBar()
	const currentProduct = useCurrentProduct()
	const contentType = useCurrentContentType()

	// TODO `setSearchResults` will be used soon
	const [searchResults, setSearchResults] = useState(DEFAULT_SEARCH_RESULTS)

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
						<DocumentationTabContents
							searchResults={searchResults.docs}
							suggestedPages={suggestedPages}
						/>
					</Tab>
					<Tab heading="Tutorials">
						<TutorialsTabContents
							searchResults={searchResults.tutorials}
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
