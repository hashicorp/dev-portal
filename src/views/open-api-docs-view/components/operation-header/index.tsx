/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party
import { ReactNode } from 'react'
import classNames from 'classnames'
// Components
import Badge from 'components/badge'
// Local
import { ContentWithPermalink } from '../content-with-permalink'
// Types
import type { OperationProps } from 'views/open-api-docs-view/types'
// Styles
import s from './operation-header.module.css'

interface OperationHeaderProps {
	slug: OperationProps['slug']
	headerSlot: ReactNode
	headerAriaLabel: string
	method: OperationProps['type']
	path: ReactNode
	className?: string
}

/**
 * Renders a header for an operation item,
 * showing the name of the operation in a linkable heading,
 * and showing other metadata such as the request type.
 */
export function OperationHeader({
	slug,
	headerSlot,
	headerAriaLabel,
	method,
	path,
	className,
}: OperationHeaderProps) {
	return (
		<div className={classNames(className, s.wrapper)}>
			<ContentWithPermalink id={slug} ariaLabel={headerAriaLabel}>
				<h3 id={slug} className={s.heading}>
					{headerSlot}
				</h3>
			</ContentWithPermalink>
			<div className={s.methodAndPath}>
				<Badge className={s.method} type="outlined" text={method} />
				<p className={s.path}>{path}</p>
			</div>
		</div>
	)
}
