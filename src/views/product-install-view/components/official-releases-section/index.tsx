/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import CardLink from 'components/card-link'
import Heading from 'components/heading'
import Text from 'components/text'
import viewStyles from 'views/product-install-view/product-install-view.module.css'
import s from './official-releases-section.module.css'

const OfficialReleasesSection = (): ReactElement => {
	return (
		<div className={s.root}>
			<Heading
				className={viewStyles.heading2}
				level={2}
				size={300}
				id="looking-for-more"
				weight="bold"
			>
				Looking for more?
			</Heading>
			<CardLink
				ariaLabel="Official releases"
				href="https://www.hashicorp.com/official-release-channels"
			>
				<Text className={s.cardTitle} size={300} weight="semibold">
					Official releases
				</Text>
				<Text className={s.cardBody} size={200}>
					All officially supported HashiCorp release channels and their security
					guarantees.
				</Text>
			</CardLink>
		</div>
	)
}

export default OfficialReleasesSection
