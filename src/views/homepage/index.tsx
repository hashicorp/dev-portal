/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import { ReactElement } from 'react'

// Global imports
import BaseLayout from 'layouts/base-layout'
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'

// Local imports
import {
	Chiclets,
	FeaturedContentGrid,
	PageTitle,
	PreFooter,
} from './components'
import s from './homepage.module.css'

function HomePageView(): ReactElement {
	return (
		<BaseLayout mobileMenuSlot={<MobileMenuLevelsGeneric />}>
			<div className={s.root}>
				<div className={s.background} />
				<div className={s.limitedWidthContainer}>
					<PageTitle />
					<Chiclets />
					<FeaturedContentGrid />
					<PreFooter
						heading="Looking for help?"
						description="We offer paid support, a free forum, and other community resources."
						actions={[
							{
								icon: 'support',
								heading: 'Support',
								description: 'Open a support ticket',
								link: 'https://support.hashicorp.com/hc/en-us',
							},
							{
								icon: 'help',
								heading: 'Forum',
								description: 'Find your answer on the forum',
								link: 'https://discuss.hashicorp.com/',
							},
							{
								icon: 'user',
								heading: 'Community',
								description: 'Join our community',
								link: 'https://www.hashicorp.com/community',
							},
						]}
					/>
				</div>
			</div>
		</BaseLayout>
	)
}

export default HomePageView
