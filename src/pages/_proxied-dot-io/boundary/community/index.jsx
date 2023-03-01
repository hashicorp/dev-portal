/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import HashiHead from '@hashicorp/react-head'
import BoundaryIoLayout from 'layouts/_proxied-dot-io/boundary'
import VerticalTextBlockList from '@hashicorp/react-vertical-text-block-list'
import SectionHeader from '@hashicorp/react-section-header'
import s from './style.module.css'

function CommunityPage() {
	return (
		<div className={s.root}>
			<HashiHead
				title="Community | Boundary by HashiCorp"
				pageName="Community | Boundary by HashiCorp"
			/>
			<SectionHeader
				headline="Community"
				description="Boundary is a newly-launched open source project. The project team depends on the community’s engagement and feedback. Get involved today."
				use_h1={true}
			/>
			<VerticalTextBlockList
				product="boundary"
				data={[
					{
						header: 'Community Forum',
						body: '<a href="https://discuss.hashicorp.com/c/boundary">Boundary Community Forum</a>',
					},
					{
						header: 'Bug Tracker',
						body: '<a href="https://github.com/hashicorp/boundary/issues">Issue tracker on GitHub</a>. Please only use this for reporting bugs. Do not ask for general help here; use the Community Form for that.',
					},
				]}
			/>
		</div>
	)
}

export function getStaticProps() {
	// This function intentionally left blank to allow Next to use SSG.
	return { props: {} }
}

CommunityPage.layout = BoundaryIoLayout
export default CommunityPage
