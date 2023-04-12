/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Heading from 'components/heading'
import s from './docs-page-heading.module.css'
import { ReactNode } from 'react'

function DocsPageHeading({
	id,
	children,
}: {
	id: string
	children: ReactNode
}) {
	return (
		<Heading className={s.root} id={id} level={1} size={600} weight="bold">
			{children}
		</Heading>
	)
}

export default DocsPageHeading
