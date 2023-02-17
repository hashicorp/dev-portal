/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { MutableRefObject, useEffect } from 'react'

/**
 * Given an array of ref objects and a callback handler, invokes the handler if
 * a `mousedown` or `touchstart` event does not occur inside of any of the ref
 * objects.
 *
 * Listens for `mousedown` and `touchstart` events by default, but this
 * can be disabled by passing `false` for the `shouldListen` parameter.
 *
 * Note: `shouldListen` is particularly useful when this hook is used in
 * components that manage an open/closed state. Passing `false` for
 * `shouldListen` when these types of components are in a closed state, and
 * `mousedown`/`touchstart` events don't need to be listened to, prevents adding
 * unnecessary event listeners to the document.
 */
export default function useOnClickOutside(
	refs: MutableRefObject<HTMLElement>[],
	handler: (event?: MouseEvent | TouchEvent) => void,
	shouldListen: boolean = true
) {
	useEffect(() => {
		const listener = (event: MouseEvent | TouchEvent) => {
			// See if any provided refs had a click inside of them
			const isClickInside = refs.some((ref: MutableRefObject<HTMLElement>) =>
				ref?.current?.contains(event.target as Node)
			)

			// Do nothing if the click was inside any provided ref or its descendants
			if (isClickInside) {
				return
			}

			// Invoke handler if the click was outside all provided refs
			handler(event)
		}

		// Listen for pointer events if `shouldListen` is true
		if (shouldListen) {
			document.addEventListener('mousedown', listener)
			document.addEventListener('touchstart', listener)
		}

		// Remove listeners upon unmounting
		return () => {
			document.removeEventListener('mousedown', listener)
			document.removeEventListener('touchstart', listener)
		}
	}, [refs, handler, shouldListen])
}
