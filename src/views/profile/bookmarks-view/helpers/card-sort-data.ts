/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ApiBookmark } from 'lib/learn-client/api/api-types'

export const SortData = {
	newest: {
		text: 'Newest',
		sort: (a: ApiBookmark, b: ApiBookmark) => {
			return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		},
	},
	oldest: {
		text: 'Oldest',
		sort: (a: ApiBookmark, b: ApiBookmark) => {
			return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
		},
	},
}
