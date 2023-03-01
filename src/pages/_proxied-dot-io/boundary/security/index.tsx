/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import BoundaryIoLayout from 'layouts/_proxied-dot-io/boundary'
import SecurityView from 'views/_proxied-dot-io/security'

function SecurityPage(): React.ReactElement {
	return (
		<SecurityView
			productName="Boundary"
			githubUrl="https://www.github.com/hashicorp/boundary"
		/>
	)
}

export function getStaticProps() {
	// This function intentionally left blank to allow Next to use SSG.
	return { props: {} }
}

SecurityPage.layout = BoundaryIoLayout
export default SecurityPage
