/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Heading from 'components/heading'
import s from './docs-plain-page-heading.module.css'

function DocsPlainPageHeading({ id, title }: { id: string; title: string }) {
	return (
		<Heading className={s.root} id={id} level={1} size={600} weight="bold">
			{title}
		</Heading>
	)
}

export default DocsPlainPageHeading
