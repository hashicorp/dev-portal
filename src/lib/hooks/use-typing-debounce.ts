/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect } from 'react'

/**
 * Delay invoking a callback until after a user has finished typing.
 *
 * Note: the `useEffect` call in this function treats `debounceTime` and
 * `callback` as dependencies. If `callback` changes in any way between
 * renders, then the debounce timer will be reset.
 *
 * To more strictly control when the debounce timer is reset, the consumer
 * of this hook should `useCallback` when declaring `callback`.
 */
export default function useTypingDebounce(
	/**
	 * Function to call when typing has not happened in the last `debounceTime`.
	 */
	callback: () => void,
	/**
	 * Time, in milliseconds, to wait to fire `callback` after typing stops.
	 */
	debounceTime: number = 300
) {
	useEffect(() => {
		const typingDebounce = setTimeout(() => {
			callback()
		}, debounceTime)

		return () => clearTimeout(typingDebounce)
	}, [callback, debounceTime])
}
