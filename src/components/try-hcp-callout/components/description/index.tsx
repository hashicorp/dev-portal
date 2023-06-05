/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import mitigateWidows from '@hashicorp/platform-util/text/mitigate-widows'
import s from './description.module.css'

/**
 * Description component, for use in HCP callout cards.
 */
export function Description({ description }: { description: string }) {
	return (
		<div
			className={s.root}
			dangerouslySetInnerHTML={{ __html: mitigateWidows(description, 15) }}
		/>
	)
}
