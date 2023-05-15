/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Text from 'components/text'
import { useHitsContext } from '../../helpers'
import s from './no-results-message.module.css'

function NoResultsMessage({
	type,
}: {
	type: 'docs' | 'integrations' | 'tutorials'
}) {
	const [hitCounts] = useHitsContext()
	return (
		<Text asElement="p" className={s.root} size={300} weight="medium">
			No results match your search.
			<pre>
				<code>{JSON.stringify({ type, hitCounts }, null, 2)}</code>
			</pre>
		</Text>
	)
}

export default NoResultsMessage
