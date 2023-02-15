/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import ConsulIoLayout from 'layouts/_proxied-dot-io/consul'
import SecurityView from 'views/_proxied-dot-io/security'

function SecurityPage(): React.ReactElement {
	return (
		<SecurityView
			productName="Consul"
			githubUrl="https://www.github.com/hashicorp/consul"
		/>
	)
}

export function getStaticProps() {
	// This function intentionally left blank to allow Next to use SSG.
	return { props: {} }
}

SecurityPage.layout = ConsulIoLayout
export default SecurityPage
