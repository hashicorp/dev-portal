/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Link from 'components/link'
import useCurrentPath from 'hooks/use-current-path'
import { ProductIconTextLockup } from '..'
import s from './product-icon-text-link.module.css'

export interface ProductIconTextLinkProps {
	slug: string
	name: string
}

export function ProductIconTextLink({ slug, name }: ProductIconTextLinkProps) {
	const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
	const url = `/${slug}`

	return (
		<Link
			aria-current={currentPath === url ? 'page' : undefined}
			aria-label={`${name} home`}
			className={s.root}
			href={url}
		>
			<ProductIconTextLockup slug={slug} name={name} />
		</Link>
	)
}
