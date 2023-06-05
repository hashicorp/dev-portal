/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	KeyboardEvent as ReactKeyboardEvent,
	MutableRefObject,
	useEffect,
} from 'react'
import deriveKeyEventState from 'lib/derive-key-event-state'

/**
 * Given an array of ref object and a callback handler, invokes the handler if a
 * `keydown` event occurs, the event's `key` is the ESCAPE key, and the event
 * occurs inside of any of the ref objects.
 *
 * Listens for `keydown` events by default, but this can be disabled by passing
 * `false` for the `shouldListen` parameter.
 *
 * Note: `shouldListen` is particularly useful when this hook is used in
 * components that manage an open/closed state. Passing `false` for
 * `shouldListen` when these types of components are in a closed state, and
 * `keydown` events don't need to be listend to, prevents adding unnecessary
 * event listeners to the document.
 */
const useOnEscapeKeyDown = (
	refs: MutableRefObject<HTMLElement>[],
	handler: (event?: KeyboardEvent) => void,
	shouldListen: boolean = true
) => {
	useEffect(() => {
		const listener = (event?: KeyboardEvent | ReactKeyboardEvent) => {
			const { isEscapeKey } = deriveKeyEventState(event as ReactKeyboardEvent)
			if (!isEscapeKey) {
				return
			}

			const isWithinRefs = refs.some((ref: MutableRefObject<HTMLElement>) =>
				ref?.current?.contains(event.target as Node)
			)
			if (isWithinRefs) {
				handler(event as KeyboardEvent)
			}
		}

		if (shouldListen) {
			document.addEventListener('keydown', listener)

			return () => {
				document.removeEventListener('keydown', listener)
			}
		}
	}, [refs, handler, shouldListen])
}

export default useOnEscapeKeyDown
