/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import PackerIoLayout from 'layouts/_proxied-dot-io/packer'
import SecurityView from 'views/_proxied-dot-io/security'

function SecurityPage(): React.ReactElement {
	return (
		<SecurityView
			productName="Packer"
			githubUrl="https://www.github.com/hashicorp/packer"
		/>
	)
}

export function getStaticProps() {
	// This function intentionally left blank to allow Next to use SSG.
	return { props: {} }
}

SecurityPage.layout = PackerIoLayout
export default SecurityPage
