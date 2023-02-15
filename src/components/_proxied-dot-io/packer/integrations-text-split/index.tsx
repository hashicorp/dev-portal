/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import TextSplitWithImage from '@hashicorp/react-text-split-with-image'

export default function IntegrationsTextSplit({
	heading,
	links,
	content,
	image,
}) {
	return (
		<TextSplitWithImage
			textSplit={{
				heading,
				product: 'packer',
				content,
				linkStyle: 'buttons',
				links,
			}}
			image={image}
		/>
	)
}
