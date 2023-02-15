/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Footer from 'components/_proxied-dot-io/vault/footer'

function FooterWithProps({
	openConsentManager,
}: {
	openConsentManager: () => void
}): React.ReactElement {
	return <Footer openConsentManager={openConsentManager} />
}

export default FooterWithProps
