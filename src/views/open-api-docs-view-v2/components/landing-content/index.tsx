/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Types
import type { OpenAPIV3 } from 'openapi-types'

export interface LandingContentProps {
	/**
	 * TODO: discard once view can be identified without this
	 */
	_placeholder: any
}

/**
 * TODO: implement this content area
 */
export default function LandingContent(props: LandingContentProps) {
	return (
		<>
			<pre style={{ whiteSpace: 'pre-wrap' }}>
				<code>{JSON.stringify(props, null, 2)}</code>
			</pre>
		</>
	)
}
