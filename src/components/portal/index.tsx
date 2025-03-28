/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
	/**
	 * class to apply to the portal wrapper element.
	 */
	className?: string

	/**
	 * Children to render within the portal
	 */
	children: React.ReactNode
}

export default function Portal({ className, children }: PortalProps) {
	/* eslint-disable react-hooks/rules-of-hooks */

	/**
	 * This is _technically_ a violation of the rules of hooks, but in this case it's a non-issue
	 * as it should always render the same number of hooks on the client or the server
	 */
	if (typeof window === 'undefined') {
		return null
	}

	const portalRef = useRef(document.createElement('div'))

	useEffect(() => {
		if (className) {
			portalRef.current.classList.add(className)
		}

		document.body.appendChild(portalRef.current)

		return () => {
			document.body.removeChild(portalRef.current)
		}
	}, [])

	return createPortal(children, portalRef.current)
}
