/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	CommandBarLinkListItem,
	CommandBarList,
} from 'components/command-bar/components'
import { SuggestedPage, SuggestedPagesProps } from './types'

const SuggestedPages = ({ pages }: SuggestedPagesProps) => {
	return (
		<CommandBarList label="Suggested Pages">
			{pages.map((page: SuggestedPage) => (
				<div key={page.url} style={{ border: '1px solid magenta' }}>
					<CommandBarLinkListItem
						icon={page.icon}
						title={page.text}
						url={page.url}
					/>
				</div>
			))}
		</CommandBarList>
	)
}

export type { SuggestedPage, SuggestedPagesProps }
export default SuggestedPages
