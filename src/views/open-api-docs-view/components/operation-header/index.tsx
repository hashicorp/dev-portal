/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
	headerText: OperationProps['operationId']
	method: OperationProps['type']
	path: OperationProps['path']['truncated']
	className?: string
}

/**
 * Renders a header for an operation item,
 * showing the name of the operation in a linkable heading,
 * and showing other metadata such as the request type.
 */
export function OperationHeader({
	slug,
	headerText,
	method,
	path,
	className,
}: OperationHeaderProps) {
	return (
		<div className={classNames(className, s.wrapper)}>
			<ContentWithPermalink id={slug} ariaLabel={headerText}>
				<h3 id={slug} className={s.heading}>
					{headerText}
				</h3>
			</ContentWithPermalink>
			<div className={s.methodAndPath}>
				<Badge className={s.method} type="outlined" text={method} />
				<p className={s.path}>{path}</p>
			</div>
		</div>
	)
}
