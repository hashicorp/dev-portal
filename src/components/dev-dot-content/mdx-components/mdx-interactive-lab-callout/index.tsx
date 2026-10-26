/**
 * Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

import type { ComponentProps } from 'react'
import InteractiveLabCallout from 'components/interactive-lab-callout'

function MdxInteractiveLabCallout(
	props: ComponentProps<typeof InteractiveLabCallout>
) {
	return <InteractiveLabCallout {...props} />
}

export { MdxInteractiveLabCallout }
