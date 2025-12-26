/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { useRef, useEffect } from 'react'

/**
 * Keep track of the previous value of a variable
 */
export default function usePrevious<T = never>(value: T) {
	const ref = useRef<T>()
	useEffect(() => {
		ref.current = value
	}, [value])
	return ref.current
}
