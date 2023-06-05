/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import s from './standalone-link-contents.module.css'

interface StandaloneLinkContentsProps {
	text: string
	size?: 'small' | 'medium'
}

/**
 * A text element that looks like a standalone link,
 * designed for use in CardLink.
 *
 * Note that there is not hover effect for this component.
 * We may want to use this component in other contexts, such as TryHcpCallout,
 * in `src/components/try-hcp-callout/standalone-link-contents` in this repo.
 * For now, this component is intentionally limited to Certifications work.
 */
function StandaloneLinkContents({
	text,
	size = 'medium',
}: StandaloneLinkContentsProps) {
	return (
		<span className={classNames(s.root, s[size])}>
			{text} <IconArrowRight16 />
		</span>
	)
}

export { StandaloneLinkContents }
