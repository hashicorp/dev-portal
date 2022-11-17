import s from './style.module.css'

export interface Variable {
	key: string
	type: string
	description?: string
	required?: boolean // Default False
	variables?: Array<Variable> // User doesn't need
}

export interface VariableGroup {
	name: string
	variables: Array<Variable>
}

interface VariableGroupListProps {
	variables: Array<Variable>
	unflatten?: boolean // Users should never set this to false, needed for recursive nesting
}

export function VariableGroupList({
	variables,
	unflatten = true,
}: VariableGroupListProps) {
	const vars: Array<Variable> = unflatten
		? unflattenVariables(variables)
		: variables
	return (
		<ul className={s.variableGroupList}>
			{vars.map((variable: Variable) => {
				return (
					<li key={variable.key}>
						<code className={s.key}>
							<strong>{variable.key}</strong>
						</code>
						<code className={s.type}>{variable.type}</code>
						{variable.description && (
							<p className={s.description}>{variable.description}</p>
						)}
						<p className={s.required}>
							{variable.required ? 'Required' : 'Optional'}
						</p>
						{variable.variables?.length > 0 && (
							<VariableGroupList
								unflatten={false}
								variables={variable.variables}
							/>
						)}
					</li>
				)
			})}
		</ul>
	)
}

function unflattenVariables(variables: Array<Variable>): Array<Variable> {
	// Pull all of the root nodes out
	const rootNodes: Array<Variable> = []

	let depth = 0
	let wasPush = true
	while (wasPush) {
		// Fill out the Variables with 0 depth moving out
		depth = depth + 1
		wasPush = false
		for (let i = 0; i < variables.length; i++) {
			const cVar = variables[i]
			const segments = cVar.key.split('.')
			// Ensure that we're looking at only variables at our depth
			if (segments.length == depth) {
				// If it's a root node, push straight to the rootNodes
				if (segments.length == 1) {
					rootNodes.push(Object.assign({}, cVar))
					wasPush = true
				} else {
					// Figure out what variable has it
					let pointer: Variable
					for (let j = 0; j < segments.length - 1; j++) {
						const segment = segments[j]
						if (j == 0) {
							pointer = rootNodes.find((e: Variable) => e.key === segment)
						} else {
							pointer = pointer.variables.find((e: Variable) =>
								e.key.endsWith(`.${segment}`)
							)
						}
					}

					// TODO; at this point we need to check if a pointer hasn't been made,
					// we need to stub in an object for it.
					if (!pointer.variables) {
						pointer.variables = []
					}
					pointer.variables.push(Object.assign({}, cVar))
					wasPush = true
				}
			}
		}
	}
	return rootNodes
}
