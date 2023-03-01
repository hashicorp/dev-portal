/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import WaypointIoLayout from 'layouts/_proxied-dot-io/waypoint'
import SecurityView from 'views/_proxied-dot-io/security'

function SecurityPage(): React.ReactElement {
	return (
		<SecurityView
			productName="Waypoint"
			githubUrl="https://www.github.com/hashicorp/waypoint"
		/>
	)
}

export function getStaticProps() {
	// This function intentionally left blank to allow Next to use SSG.
	return { props: {} }
}

SecurityPage.layout = WaypointIoLayout
export default SecurityPage
