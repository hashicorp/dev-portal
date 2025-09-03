/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { forwardRef, useEffect, useState, type ReactNode } from 'react'

/**
 * This hidden element acts solely as a container
 * that we can fetch textContent to copy to clipboard.
 * This allows to ignore the "how will we copy this cleanly"
 * concern when splitting code into lines, and adding
 * line numbers and so on in other parts of code-block.
 */
const HiddenCopyContentComponent = (
	{ code }: { code: ReactNode },
	copyRef: React.ForwardedRef<HTMLPreElement>
) => {
	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		setIsClient(true)
	}, [])

	/**
	 * We are avoiding SSR here as this component is only used for the copy-to-clipboard interaction, and so rendering
	 * the text content of the code introduces duplicate markup and some difficult-to-debug hydration mismatches.
	 * By the time someone interacts with the copy-to-clipboard functionality, this should be rendered.
	 */
	if (!isClient) return null

	return (
		<pre ref={copyRef} style={{ display: 'none' }}>
			{typeof code === 'string' ? (
				<span dangerouslySetInnerHTML={{ __html: code }} />
			) : (
				code
			)}
		</pre>
	)
}

const HiddenCopyContent = forwardRef(HiddenCopyContentComponent)

export { HiddenCopyContent }
