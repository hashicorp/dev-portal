import React from 'react'
import classNames from 'classnames'
import {
	AutocompleteState,
	createAutocomplete,
} from '@algolia/autocomplete-core'
import { Hit } from '@algolia/client-search'
import { IconSearch16 } from '@hashicorp/flight-icons/svg-react/search-16'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import { IconSlashSquare16 } from '@hashicorp/flight-icons/svg-react/slash-square-16'
import useFocusOnKeyClick from 'hooks/use-focus-on-key-click'
import useOnRouteChangeStart from 'hooks/use-on-route-change-start'
import Panel from './components/panel'
import { useAlgoliaNavigatorNext } from './lib/use-algolia-navigator-next'
import { AlgoliaSearchPops } from './types'

import s from './algolia-search.module.css'

/**
 * Algolia search UI implementation, based on the utilities from @algolia/autocomplete-core
 *
 * We're not using Algolia's fully-baked UI implementation, @algolia/autocomplete-js, as we need
 * to be able to customize all parts of the UI.
 */
export default function AlgoliaSearch<THit extends Hit<unknown>>({
	ResultComponent,
	getHitLinkProps,
	className,
	...props
}: AlgoliaSearchPops<THit>) {
	const inputRef = React.useRef<HTMLInputElement>(null)
	const formRef = React.useRef<HTMLFormElement>(null)
	const panelRef = React.useRef<HTMLDivElement>(null)

	const navigator = useAlgoliaNavigatorNext<THit>()

	/**
	 * Initialize Algolia's autocomplete instance and its state
	 */
	const [autocompleteState, setAutocompleteState] = React.useState<
		AutocompleteState<THit>
	>({
		collections: [],
		completion: null,
		context: {},
		isOpen: false,
		query: '',
		activeItemId: null,
		status: 'idle',
	})

	const autocomplete = React.useMemo(() => {
		return createAutocomplete<
			THit,
			React.BaseSyntheticEvent,
			React.MouseEvent,
			React.KeyboardEvent
		>({
			onStateChange({ state }) {
				setAutocompleteState(state)
			},
			shouldPanelOpen({ state }) {
				/**
				 * Default behavior opens when there are collection items[]
				 * this overrides to show whenever there's a query to enable
				 * a 'no results state handled in the panel
				 */
				return Boolean(state.query)
			},
			navigator,
			...props,
		})
	}, [])

	const inputProps = autocomplete.getInputProps({
		inputElement: inputRef.current,
	})

	/**
	 * Clear the query input on route change
	 */
	useOnRouteChangeStart({
		handler: () => {
			autocomplete.setQuery('')
		},
	})

	/**
	 * Initialize event listeners for touch events
	 */
	const { getEnvironmentProps } = autocomplete

	React.useEffect(() => {
		if (!formRef.current || !panelRef.current || !inputRef.current) {
			return undefined
		}

		const { onTouchStart, onTouchMove } = getEnvironmentProps({
			formElement: formRef.current,
			inputElement: inputRef.current,
			panelElement: panelRef.current,
		})

		window.addEventListener('touchstart', onTouchStart)
		window.addEventListener('touchmove', onTouchMove)

		return () => {
			window.removeEventListener('touchstart', onTouchStart)
			window.removeEventListener('touchmove', onTouchMove)
		}
	}, [getEnvironmentProps, formRef, inputRef, panelRef])

	/**
	 * Allow focusing of the search input on pressing '/'
	 */
	useFocusOnKeyClick(inputRef, '/')

	return (
		<div
			className={classNames(s.root, className)}
			{...autocomplete.getRootProps({})}
		>
			<form
				ref={formRef}
				className={s.form}
				{...autocomplete.getFormProps({ inputElement: inputRef.current })}
				onSubmit={(e) => e.preventDefault()}
			>
				<div className={s.inputWrapperPrefix}>
					<label {...autocomplete.getLabelProps({})}>
						<button className={s.submitButton} type="submit" title="Submit">
							<IconSearch16 />
						</button>
					</label>
				</div>
				<input
					className={s.input}
					ref={inputRef}
					{...inputProps}
					onBlur={() => {
						autocomplete.setIsOpen(false)
						inputProps.onBlur()
					}}
				/>
				<div className={s.inputWrapperSuffix}>
					<button
						className={s.clearButton}
						title="Clear"
						type="reset"
						hidden={!autocompleteState.query}
					>
						<IconX16 />
					</button>
				</div>
				{autocompleteState.query ? null : (
					<IconSlashSquare16
						className={s.keyboardHintIcon}
						title="Type '/' to Search"
					/>
				)}
			</form>
			{autocompleteState.isOpen && (
				<Panel
					autocomplete={autocomplete}
					collections={autocompleteState.collections}
					ResultComponent={ResultComponent}
					getHitLinkProps={getHitLinkProps}
					formRef={formRef}
				/>
			)}
		</div>
	)
}

export { Highlight } from './components/highlight'
