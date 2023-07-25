import type { OperationProps } from 'views/open-api-docs-view/types'
import s from './operation-header.module.css'

/**
 * Renders a header for an operation item,
 * showing the name of the operation in a linkable heading,
 * and showing other metadata such as the request type.
 *
 * TODO: implement this presentation component.
 */
export function OperationHeader({ operation }: { operation: OperationProps }) {
	const { slug, operationId } = operation
	return (
		<div style={{ border: '1px solid magenta' }}>
			<h3 id={slug} className={s.heading}>
				{operationId}
			</h3>
		</div>
	)
}
