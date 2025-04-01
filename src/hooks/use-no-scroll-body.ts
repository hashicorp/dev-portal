/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect, useState } from 'react'

/**
 * Ensures the body can't be scrolled while the boolean
 * trigger passed is true
 */

export function useNoScrollBody(trigger: boolean): void {
	const [initialValue, setInitialValue] = useState(null)

	useEffect(() => {
		if (initialValue === null) {
			setInitialValue(document.body.style.overflow)
		}

		if (trigger) {
			document.body.style.overflow = 'hidden'
		} else if (!trigger && document.body.style.overflow === 'hidden') {
			document.body.style.overflow = initialValue
		}

		// reset on component unmount
		return () => {
			document.body.style.overflow = initialValue
		}
	}, [initialValue, trigger])
}
