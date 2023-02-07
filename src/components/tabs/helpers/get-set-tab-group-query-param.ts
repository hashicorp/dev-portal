import { NextRouter } from 'next/router'

const TAB_GROUP_PARAM_KEY = 'tabGroup'

/**
 * Returns the current value of the `tabGroup` query param.
 */
const getTabGroupQueryParam = (): null | string => {
	let tabGroupParam: null | string = null

	if (typeof window !== 'undefined') {
		const currentUrlSearchParams = new URLSearchParams(window.location.search)
		tabGroupParam = currentUrlSearchParams.get(TAB_GROUP_PARAM_KEY)
	}

	return tabGroupParam
}

/**
 * Handles updating the `tabGroup` query param without reloading the page.
 */
const setTabGroupQueryParam = ({
	newValue,
	router,
}: {
	newValue: string
	router: NextRouter
}) => {
	const urlObject = new URL(window.location.toString())
	urlObject.searchParams.set(TAB_GROUP_PARAM_KEY, newValue)
	router.replace(urlObject.toString(), null, { shallow: true })
}

export { getTabGroupQueryParam, setTabGroupQueryParam, TAB_GROUP_PARAM_KEY }
