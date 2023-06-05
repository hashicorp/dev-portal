/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import { IconDownload16 } from '@hashicorp/flight-icons/svg-react/download-16'
import { IconDownload24 } from '@hashicorp/flight-icons/svg-react/download-24'
import { MobileDownloadStandaloneLinkProps } from './types'
import MobileStandaloneLink from 'components/mobile-standalone-link'

const MobileDownloadStandaloneLink = ({
	ariaLabel,
	href,
	onClick,
}: MobileDownloadStandaloneLinkProps): ReactElement => (
	<MobileStandaloneLink
		ariaLabel={ariaLabel}
		download
		href={href}
		size16Icon={<IconDownload16 />}
		size24Icon={<IconDownload24 />}
		iconPosition="trailing"
		onClick={onClick}
		text="Download"
	/>
)

export default MobileDownloadStandaloneLink
