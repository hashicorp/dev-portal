/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Badge from 'components/badge'
import s from '../algolia-search.module.css'

export default function SearchResultsLegend() {
	return (
		<div className={s.legend}>
			<Badge text="↑" /> <Badge text="↓" /> to navigate, <Badge text="ENTER" />{' '}
			to select, <Badge text="ESC" /> to dismiss
		</div>
	)
}
