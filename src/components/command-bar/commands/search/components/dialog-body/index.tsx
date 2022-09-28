import { useCallback, useMemo, useRef } from 'react'
import algoliasearch from 'algoliasearch'
import { Configure, InstantSearch } from 'react-instantsearch-hooks-web'
import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconLearn16 } from '@hashicorp/flight-icons/svg-react/learn-16'
import { ProductSlug } from 'types/products'
import { useCurrentContentType, useCurrentProduct } from 'contexts'
import { CommandBarTag, useCommandBar } from 'components/command-bar'
import { useSetUpAndCleanUpCommandState } from 'components/command-bar/hooks'
import Tabs, { Tab } from 'components/tabs'
import {
	generateSuggestedPages,
	generateTutorialLibraryCta,
	getCurrentProductTag,
} from '../../helpers'
import {
	SuggestedPage,
	SuggestedPages,
	DocumentationTabContents,
	TutorialsTabContents,
} from '../'
import s from './search-command-bar-dialog-body.module.css'
import { CommandBarDivider } from 'components/command-bar/components'

// TODO(brkalow): We might consider lazy-loading the search client & the insights library
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
const searchClient = algoliasearch(appId, apiKey)

const SearchCommandBarDialogBodyContent = ({
	currentProductTag,
}: {
	currentProductTag: CommandBarTag
}) => {
	const { currentInputValue } = useCommandBar()
	const contentType = useCurrentContentType()
	const ref = useRef<HTMLDivElement>()

	/**
	 * Generate suggested pages, memoized.
	 */
	const suggestedPages = useMemo<SuggestedPage[]>(() => {
		return generateSuggestedPages(currentProductTag?.id as ProductSlug)
	}, [currentProductTag])

	return currentInputValue ? (
		<div
			className={s.tabsWrapper}
			style={{ paddingBottom: 0, display: 'flex', flexDirection: 'column' }}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					borderBottom: '1px solid var(--token-color-border-primary)',
					marginRight: 30,
				}}
			>
				<button
					className="hds-typography-body-200"
					style={{
						alignItems: 'center',
						backgroundColor: 'transparent',
						display: 'flex',
						gap: 6,
						color: 'var(--token-color-foreground-action)',
						border: 'none',
						fontWeight: 'var(--token-typography-font-weight-medium)',
						padding: '8px 12px 6px',
						position: 'relative',
						cursor: 'pointer',
					}}
					onClick={(e) => {
						const heading = ref?.current?.querySelector(
							'#documentation-results'
						)
						ref.current.scrollTo(
							0,
							heading.getBoundingClientRect().top -
								(e.target as HTMLButtonElement).getBoundingClientRect().bottom -
								12
						)
					}}
				>
					<IconDocs16 />
					<span>Documentation</span>
					<span
						style={{
							backgroundColor: 'var(--token-color-palette-blue-200)',
							borderRadius: '3px',
							bottom: '-1px',
							content: '',
							height: '3px',
							left: 0,
							position: 'absolute',
							right: 0,
							zIndex: 1,
							cursor: 'pointer',
						}}
					/>
				</button>
				<button
					className="hds-typography-body-200"
					style={{
						alignItems: 'center',
						backgroundColor: 'transparent',
						display: 'flex',
						gap: 6,
						color: 'var(--token-color-foreground-faint)',
						border: 'none',
						fontWeight: 'var(--token-typography-font-weight-medium)',
						padding: '8px 12px 6px',
						position: 'relative',
						cursor: 'pointer',
					}}
					onClick={(e) => {
						const heading = ref?.current?.querySelector('#tutorial-results')
						ref.current.scrollTo(
							0,
							heading.getBoundingClientRect().top -
								(e.target as HTMLButtonElement).getBoundingClientRect().bottom -
								24
						)
					}}
				>
					<IconLearn16 />
					<span>Tutorials</span>
				</button>
			</div>
			<div
				ref={ref}
				style={{
					overflowY: 'auto',
					paddingRight: 16,
					paddingLeft: 2,
					paddingBottom: 24,
				}}
			>
				<h2
					id="documentation-results"
					className="hds-typography-body-100"
					style={{
						margin: 0,
						color: 'var(--token-color-foreground-primary)',
						marginTop: 8,
						paddingLeft: '8px',
						paddingRight: '8px',
						fontWeight: 600,
						cursor: 'pointer',
					}}
				>
					Documentation results
				</h2>
				<DocumentationTabContents
					currentProductTag={currentProductTag}
					suggestedPages={suggestedPages}
				/>
				<CommandBarDivider />
				<h2
					id="tutorial-results"
					className="hds-typography-body-100"
					style={{
						margin: 0,
						color: 'var(--token-color-foreground-primary)',
						marginTop: 8,
						paddingLeft: '8px',
						paddingRight: '8px',
						fontWeight: 600,
					}}
				>
					Tutorial results
				</h2>
				<TutorialsTabContents
					currentProductTag={currentProductTag}
					tutorialLibraryCta={generateTutorialLibraryCta(currentProductTag)}
				/>
			</div>
			{/* <Tabs
				showAnchorLine={false}
				initialActiveIndex={contentType === 'tutorials' ? 1 : 0}
				variant="compact"
			>
				<Tab heading="Documentation" icon={<IconDocs16 />}>
					<DocumentationTabContents
						currentProductTag={currentProductTag}
						suggestedPages={suggestedPages}
					/>
				</Tab>
				<Tab heading="Tutorials" icon={<IconLearn16 />}>
					<TutorialsTabContents
						currentProductTag={currentProductTag}
						tutorialLibraryCta={generateTutorialLibraryCta(currentProductTag)}
					/>
				</Tab>
			</Tabs> */}
		</div>
	) : (
		<div className={s.suggestedPagesWrapper}>
			<SuggestedPages pages={suggestedPages} />
		</div>
	)
}

const SearchCommandBarDialogBody = () => {
	const currentProduct = useCurrentProduct()
	const { addTag, currentInputValue, currentTags, removeTag } = useCommandBar()

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

	return (
		<InstantSearch
			indexName={__config.dev_dot.algolia.tutorialsIndexName}
			searchClient={searchClient}
		>
			<Configure query={currentInputValue} />
			<SearchCommandBarDialogBodyContent
				currentProductTag={currentProductTag}
			/>
		</InstantSearch>
	)
}

export default SearchCommandBarDialogBody
