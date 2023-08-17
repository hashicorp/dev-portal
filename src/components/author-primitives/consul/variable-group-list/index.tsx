/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconCornerDownRight16 } from '@hashicorp/flight-icons/svg-react/corner-down-right-16'
import classNames from 'classnames'
import Badge from 'components/badge'
import MdxHeadingPermalink from 'components/dev-dot-content/mdx-components/mdx-heading-permalink'
import { getVariableSlug } from 'views/product-integration/component-view/helpers'
import DevDotContent from 'components/dev-dot-content'
import {
	MdxA,
	MdxInlineCode,
	MdxP,
} from 'components/dev-dot-content/mdx-components'
import EnterpriseAlertBase from '@hashicorp/react-enterprise-alert'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import s from './style.module.css'

/**
 * We use some custom elements to decrease the font size for paragraph
 * content when rendering processed MDX variable descriptions.
 */
const smallDescriptionMdxComponents = {
	inlineCode: (props) => <MdxInlineCode {...props} size="100" />,
	p: (props) => <MdxP {...props} size={200} />,
	a: (props) => <MdxA {...props} textSize={200} />,
}

export interface Variable {
	name: string
	type: string
	/**
	 * Optional. Description MDX is used to render description content.
	 */
	// descriptionHtml?: string
	/**
	 * Optional, but required if passing description MDX. The plain description
	 * string is not rendered, but it is used for search and filter purposes.
	 */
	isHCLTab?: boolean
	description?: any
	enterprise?: boolean | false
	required: boolean | null
	children?: Array<Variable> // User doesn't need to specify this
	highlight?: boolean // Default false
	default_value?: string | ''
}

export interface VariableGroup {
	name: string
	children: Array<Variable>
}

export interface VariableGroupListProps {
	parent: string
	children: Array<Variable>
	unflatten?: boolean // Users should never set this to false, needed for recursive nesting
	isNested?: boolean
}

export function VariableGroupList({
	parent,
	children,
	unflatten = true,
	isNested = false,
}: VariableGroupListProps) {
	const vars: Array<Variable> = unflatten
		? unflattenVariables(children)
		: children

	return (
		<ul className={s.variableGroupList}>
			{vars.map((variable: Variable) => {
				// Move name logic over
				let keyName = variable.isHCLTab
					? variable.name
					: toYAMLKeyName(variable.name)

				keyName = parent ? `${parent}.${keyName}` : keyName

				const hasChildren = variable.children?.length > 0

				/**
				 * Construct a permalink slug for this specific variable
				 */
				const permalinkId = keyName

				// Move description logic over
				let description = ''
				if (variable.description) {
					if (typeof variable.description === 'string') {
						description = variable.description
					} else if (!variable.isHCLTab && variable.description.yaml) {
						description = variable.description.yaml
					} else if (variable.description.hcl) {
						description = variable.description.hcl
					}
				}

				return (
					<li
						key={keyName}
						className={classNames(s.variableGroupListItem, {
							[s.highlight]: variable.highlight,
						})}
					>
						{isNested ? (
							<div className={s.arrowIcon}>
								<IconCornerDownRight16 />
							</div>
						) : (
							<></>
						)}
						<div className={s.indentedContent}>
							<div className={s.topRow}>
								<span className={s.left}>
									<code id={permalinkId} className={s.key}>
										{keyName}
									</code>
									{variable.enterprise && <EnterpriseAlert inline />}
									{variable.required != null && (
										<span
											className={classNames(s.required, {
												[s.isRequired]: variable.required,
											})}
										>
											{variable.required ? 'Required' : 'Optional '}
											{variable.default_value && (
												<>
													(Default: <code>{variable.default_value}</code>)
												</>
											)}
										</span>
									)}
									<MdxHeadingPermalink
										className={s.permalink}
										ariaLabel={`${keyName} permalink`}
										level={4}
										href={`#${permalinkId}`}
									/>
								</span>
								{variable.type ? (
									<Badge
										type={
											variable.children && variable.children.length > 0
												? 'inverted'
												: 'filled'
										}
										color="highlight"
										text={variable.type}
									/>
								) : (
									<></>
								)}
							</div>

							<div className={s.description}>
								{variable.description ? (
									// <DevDotContent
									// 	mdxRemoteProps={{
									// 		compiledSource: markdownToHtml(description),
									// 		scope: {},
									// 		components: smallDescriptionMdxComponents,
									// 	}}
									// />
									<DevDotContent>
										<span
											dangerouslySetInnerHTML={{
												__html: markdownToHtml(description),
											}}
										/>
									</DevDotContent>
								) : null}
							</div>

							{hasChildren && (
								<VariableGroupList
									unflatten={false}
									parent={keyName}
									children={variable.children}
									isNested={true}
								/>
							)}
						</div>
					</li>
				)
			})}
		</ul>
	)
}

function unflattenVariables(children: Array<Variable>): Array<Variable> {
	// Pull all of the root nodes out
	const rootNodes: Array<Variable> = []

	let maxDepth = 0
	children
		.map((v: Variable) => v.name)
		.forEach((key: string) => {
			const keyDepth = key.split('.').length
			if (keyDepth > maxDepth) {
				maxDepth = keyDepth
			}
		})

	for (let depth = 1; depth - 1 < maxDepth; depth++) {
		// Fill out the Variables with 0 depth moving out
		for (let i = 0; i < children.length; i++) {
			const cVar = children[i]
			const segments = cVar.name.split('.')
			// Ensure that we're looking at only variables at our depth
			if (segments.length == depth) {
				// If it's a root node, push straight to the rootNodes
				if (segments.length == 1) {
					rootNodes.push(Object.assign({}, cVar))
				} else {
					// Figure out what variable has it
					let pointer: Variable
					for (let j = 0; j < segments.length - 1; j++) {
						const segment = segments[j]
						if (j == 0) {
							pointer = rootNodes.find((e: Variable) => e.name === segment)
							// A nested variable was defined without specifying the parent root variable
							// we need to create the parent object for appropriate nesting
							if (!pointer) {
								pointer = {
									type: 'category',
									required: null,
									name: segments.slice(0, j + 1).join('.'),
									children: [],
								}
								rootNodes.push(pointer)
							}
						} else {
							const oldPointer = pointer
							pointer = pointer.children.find((e: Variable) =>
								e.name.endsWith(`.${segment}`)
							)
							// A nested variable was defined without specifying the parent
							// we need to create the parent object for appropriate nesting
							if (!pointer) {
								pointer = {
									type: 'category',
									required: null,
									name: segments.slice(0, j + 1).join('.'),
									children: [],
								}
								oldPointer.children.push(pointer)
							}
						}
					}
					if (!pointer.children) {
						pointer.children = []
					}
					pointer.children.push(Object.assign({}, cVar))
				}
			}
		}
	}
	return rootNodes
}

/**
 * Converts an HCL key name to a kube yaml key name.
 *
 * Examples:
 * - Protocol => protocol
 * - MeshGateway => meshGateway
 * - ACLToken => aclToken
 * - HTTP => http
 *
 * @param {string} hclKey
 * @returns {string}
 */
function toYAMLKeyName(hclKey) {
	// Handle something like HTTP.
	if (hclKey.toUpperCase() === hclKey) {
		return hclKey.toLowerCase()
	}

	let indexFirstLowercaseChar = hclKey
		.split('')
		.findIndex((c) => c === c.toLowerCase())
	// Special case to handle something like ACLToken => aclToken.
	if (indexFirstLowercaseChar > 1) {
		indexFirstLowercaseChar--
	}

	let lowercasePortion = ''
	for (let i = 0; i < indexFirstLowercaseChar; i++) {
		lowercasePortion += hclKey[i].toLowerCase()
	}
	return (
		lowercasePortion + hclKey.split('').slice(indexFirstLowercaseChar).join('')
	)
}

/**
 * Converts a markdown string to its HTML representation.
 * Currently it only supports inline code blocks (e.g. `code here`) and
 * links (e.g. [link text](http://link-url) because these were the most
 * commonly used markdown features in the key descriptions.
 *
 * @param {string} markdown the input markdown
 * @returns {string}
 */
function markdownToHtml(markdown) {
	let html = markdown

	// Replace inline code blocks defined by backticks with <code></code>.
	while (html.indexOf('`') > 0) {
		html = html.replace('`', '<code>')
		if (html.indexOf('`') <= 0) {
			throw new Error(`'${markdown} does not have matching '\`' characters`)
		}
		html = html.replace('`', '</code>')
	}

	// Replace links, e.g. [link text](http://link-url),
	// with <a href="http://link-url">link text</a>.
	return html.replace(/\[(.*?)]\((.*?)\)/g, '<a href="$2">$1</a>')
}

/**
 * Returns true if key is a key used at the top level of a CRD. By top level we
 * mean not nested under any other key.
 *
 * @param {string} name name of the key
 *
 * @return {boolean}
 */
function isTopLevelKubeKey(name) {
	return (
		name.toLowerCase() === 'metadata' ||
		name.toLowerCase() === 'kind' ||
		name.toLowerCase() === 'apiversion'
	)
}

function EnterpriseAlert(props) {
	return <EnterpriseAlertBase product={'consul'} {...props} />
}
