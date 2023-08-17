/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconAwsColor16 } from '@hashicorp/flight-icons/svg-react/aws-color-16'
import InlineSvg from '@hashicorp/react-inline-svg'
import IconAwsColorWhite16 from './img/aws-dark-mode.svg?include'

/**
 * flight-icons should soon support the 'dark mode' version of this icon.
 * For now it lives locally in `./img`
 */

export default function ThemedAwsIcon() {
	return (
		<>
			<span data-hide-on-theme="dark">
				<IconAwsColor16 />
			</span>
			<span data-hide-on-theme="light">
				<InlineSvg src={IconAwsColorWhite16} />
			</span>
		</>
	)
}
