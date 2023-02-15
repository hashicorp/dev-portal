/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import HashiHead from '@hashicorp/react-head'
import WaypointIoLayout from 'layouts/_proxied-dot-io/waypoint'
import styles from './style.module.css'
import VerticalTextBlockList from '@hashicorp/react-vertical-text-block-list'
import SectionHeader from '@hashicorp/react-section-header'

function CommunityPage() {
	return (
		<div className={styles.communityPage}>
			<HashiHead
				title="Community | Waypoint by HashiCorp"
				pageName="Community | Waypoint by HashiCorp"
			/>
			<div className={styles.sectionHeaderWrapper}>
				<SectionHeader
					headline="Community"
					description="Waypoint is a newly-launched open source project. The project team depends on the community’s engagement and feedback. Get involved today."
					use_h1={true}
				/>
			</div>
			<VerticalTextBlockList
				product="waypoint"
				data={[
					{
						header: 'Community Forum',
						body: '<a href="https://discuss.hashicorp.com/c/waypoint">Waypoint Community Forum</a>',
					},
					{
						header: 'Bug Tracker',
						body: '<a href="https://github.com/hashicorp/waypoint/issues">Issue tracker on GitHub</a>. Please only use this for reporting bugs. Do not ask for general help here; use the Community Form for that.',
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

CommunityPage.layout = WaypointIoLayout
export default CommunityPage
