import type { OperationProps } from 'views/open-api-docs-view/types'
import Badge from 'components/badge'
import s from './operation-header.module.css'

/**
 * Renders a header for an operation item,
 * showing the name of the operation in a linkable heading,
 * and showing other metadata such as the request type.
 */

interface OperationHeaderProps {
	slug: OperationProps['slug']
	id: OperationProps['operationId']
	type: string
	path: string
}

export function OperationHeader({
	slug,
	id,
	type,
	path,
}: OperationHeaderProps) {
	return (
		<div className={s.wrapper}>
			<h3 id={slug} className={s.heading}>
				{id}
			</h3>
			<div className={s.methodAndPath}>
				<Badge type="outlined" text={type.toUpperCase()} />
				<p className={s.path}>{path}</p>
			</div>
		</div>
	)
}
