/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import s from './overview-contents.module.css'

/**
 * Render some overview contents for an OpenAPI spec landing page.
 *
 * TODO: write a better description
 */
export default function OverviewContents({
	_devProps,
}: {
	_devProps: $TSFixMe
}) {
	return (
		<div className={s.root}>
			<h1>{_devProps.metadata.title} API</h1>
			<p>TODO: add some OpenAPI overview content here</p>
			<pre>
				<code>{JSON.stringify({ _devProps }, null, 2)}</code>
			</pre>
		</div>
	)
}
