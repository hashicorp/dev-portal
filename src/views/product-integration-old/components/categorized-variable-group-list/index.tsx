import {
	Variable,
	VariableGroupList,
	VariableGroupListProps,
} from '../variable-group-list'

export default function CategorizedVariableGroupList({
	variables,
}: VariableGroupListProps) {
	let hasRequired = false
	let hasOptional = false
	let onlyHasNull = true

	variables.forEach((v) => {
		if (v.required !== null) {
			onlyHasNull = false
		}
		if (v.required) {
			hasRequired = true
		} else {
			hasOptional = true
		}
	})

	// Partition variables into "required" and "optional",
	// by root-level nodes only. Any sub-nodes `required`
	// property will be ignored, and will follow the
	// parent node's `required` property.
	const partitions = variables.reduce(
		(acc, v) => {
			const isRoot = v.key.split('.').length === 1
			const isRequired = v.required

			// root
			if (isRoot) {
				// update internal map for sub-nodes' to lookup
				acc._roots[v.key] = isRequired
				// push to correct partition
				isRequired ? acc.required.push(v) : acc.optional.push(v)
			} else {
				// sub-node
				// lookup parent node's `required` property
				const rootKey = v.key.split('.')[0]
				// push to correct partition
				acc._roots[rootKey] ? acc.required.push(v) : acc.optional.push(v)
			}

			return acc
		},
		{
			_roots: {} as Record<string, boolean>,
			required: [] as Variable[],
			optional: [] as Variable[],
		}
	)

	return (
		<>
			{!onlyHasNull ? (
				<>
					{hasRequired && (
						<>
							<h3>Required</h3>
							<VariableGroupList variables={partitions.required} />
						</>
					)}
					{hasOptional && (
						<>
							<h3>Optional</h3>
							<VariableGroupList variables={partitions.optional} />
						</>
					)}
				</>
			) : (
				<>
					<VariableGroupList variables={variables} />
				</>
			)}
		</>
	)
}
