/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { AutosizedHeadingBlockProps } from '../autosized-heading-block'

interface SectionHeadingBlockProps {
	level: AutosizedHeadingBlockProps['level']
	id: AutosizedHeadingBlockProps['id']
	text: AutosizedHeadingBlockProps['text']
}

export type { SectionHeadingBlockProps }
