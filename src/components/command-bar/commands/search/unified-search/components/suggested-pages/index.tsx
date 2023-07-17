/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Text from 'components/text'
import LinkRegion from 'components/link-region'
import IconTile from 'components/icon-tile'
import { CommandBarList } from 'components/command-bar/components'
import { SuggestedPageProps } from './types'
// Styles
import s from './suggested-page.module.css'

/**
 * Renders a single suggested page list item.
 */
function SuggestedPage({ icon, url, text }: SuggestedPageProps) {
	return (
		<LinkRegion className={s.root} href={url} ariaLabel={text}>
			<div className={s.content}>
				<IconTile className={s.icon} size="small">
					{icon}
				</IconTile>
				<Text
					dangerouslySetInnerHTML={{ __html: text }}
					asElement="span"
					className={s.text}
					size={300}
					weight="medium"
				/>
			</div>
		</LinkRegion>
	)
}

/**
 * Renders a list of suggested search result pages.
 */
function SuggestedPages({ pages }: { pages: SuggestedPageProps[] }) {
	return (
		<CommandBarList label="Suggested Pages">
			{pages.map(({ url, icon, text }: SuggestedPageProps) => (
				<li key={url}>
					<SuggestedPage icon={icon} text={text} url={url} />
				</li>
			))}
		</CommandBarList>
	)
}

export default SuggestedPages
