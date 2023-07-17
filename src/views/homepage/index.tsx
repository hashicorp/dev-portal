/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import { ReactElement } from 'react'

// Global imports
import BaseNewLayout from 'layouts/base-new'

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
	)
}

/**
 * `contentType` is set to "tutorials" so that all of the featured Search
 * options will show the Tutorials tab by default. If we decide to feature
 * Search terms that should show other tabs on click, then CommandBar will need
 * to have functionality added to do so.
 */
HomePageView.contentType = 'tutorials'
HomePageView.layout = BaseNewLayout

export default HomePageView
