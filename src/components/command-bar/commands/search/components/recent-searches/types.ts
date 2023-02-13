/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

type RecentSearch = string

interface RecentSearchesProps {
	recentSearches: RecentSearch[]
}

export type { RecentSearch, RecentSearchesProps }
