import {
	VariableGroupList,
	VariableGroupListProps,
} from '../variable-group-list'

export default function CategorizedVariableGroupList({
	variables,
}: VariableGroupListProps) {
	let hasRequired = false
	let hasOptional = false
	variables.forEach((v) => {
		if (v.required) {
			hasRequired = true
		} else {
			hasOptional = true
		}
	})
	return (
		<>
			{hasRequired && hasOptional ? (
				<>
					<h3>Required</h3>
					<VariableGroupList variables={variables.filter((v) => v.required)} />
					<h3>Optional</h3>
					<VariableGroupList variables={variables.filter((v) => !v.required)} />
				</>
			) : (
				<>
					{hasRequired && <h3>Required</h3>}
					<VariableGroupList variables={variables} />
				</>
			)}
		</>
	)
}
