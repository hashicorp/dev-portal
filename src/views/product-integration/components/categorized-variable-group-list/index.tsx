import {
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

	return (
		<>
			{!onlyHasNull ? (
				<>
					{hasRequired && (
						<>
							<h3>Required</h3>
							<VariableGroupList
								variables={variables.filter((v) => v.required)}
							/>
						</>
					)}
					{hasOptional && (
						<>
							<h3>Optional</h3>
							<VariableGroupList
								variables={variables.filter((v) => !v.required)}
							/>
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
