/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { MdxInlineCode } from 'components/dev-dot-content/mdx-components'
import Badge from 'components/badge'
import { IconCornerDownRight16 } from '@hashicorp/flight-icons/svg-react/corner-down-right-16'
import s from './property-details.module.css'

export type PropertyDetailsProps = {
	name: string
	type: string
	isRequired?: boolean
	description?: string // Plain text or HTML
	nestedProperties?: PropertyDetailsProps[]
	depth?: number
}

/**
 * - name string (shown as MDX inline code, with border)
 * - type string (shown as code without border)
 * - (optional) required boolean (shows badge)
 * - (optional) description markdown
 * - (optional) nested properties
 *
 * TODO: will need to support "beta" badge for HCP Packer docs.
 */
export function PropertyDetails({
	name,
	type,
	isRequired,
	description,
	nestedProperties,
	depth = 0,
}: PropertyDetailsProps) {
	if (depth === 0) {
		return (
			<div className={s.baseProperty}>
				<div className={s.basePropertyMeta}>
					<MdxInlineCode>{name}</MdxInlineCode>
					<span className={s.basePropertyType}>{type}</span>
					{isRequired ? <Badge text="Required" color="highlight" /> : null}
				</div>
				{description ? (
					<div
						className={s.basePropertyDescription}
						dangerouslySetInnerHTML={{ __html: description }}
					/>
				) : null}
				{nestedProperties?.length > 0 ? (
					<>
						<hr className={s.baseNestedDivider} />
						<NestedProperties
							nestedProperties={nestedProperties}
							depth={depth}
						/>
					</>
				) : null}
			</div>
		)
	} else {
		return (
			<PropertyDetailsNested
				name={name}
				type={type}
				isRequired={isRequired}
				description={description}
				nestedProperties={nestedProperties}
			/>
		)
	}
}

/**
 * TODO: write description
 */
function NestedProperties({
	nestedProperties,
	depth,
}: Pick<PropertyDetailsProps, 'nestedProperties' | 'depth'>) {
	return (
		<ul className={s.nestedPropertyList}>
			{nestedProperties.map((nestedProperty, idx) => {
				return (
					<li key={idx}>
						<PropertyDetailsNested {...nestedProperty} depth={depth + 1} />
					</li>
				)
			})}
		</ul>
	)
}

/**
 * TODO: write description
 *
 * Also, maybe split this out to a separate file?
 */
function PropertyDetailsNested({
	name,
	type,
	isRequired,
	description,
	nestedProperties,
	depth = 0,
}: PropertyDetailsProps) {
	return (
		<div className={s.nestedProperty}>
			<div className={s.nestedPropertyMeta}>
				<IconCornerDownRight16 className={s.nestedPropertyIcon} />
				<code className={s.nestedPropertyName}>{name}</code>
				<span className={s.nestedPropertyType}>{type}</span>
				{isRequired ? (
					<Badge text="Required" color="highlight" size="small" />
				) : null}
			</div>
			<div className={classNames(s.nestedPropertyBody, s[`depth-${depth}`])}>
				{description ? (
					<div
						className={s.nestedPropertyDescription}
						dangerouslySetInnerHTML={{ __html: description }}
					/>
				) : null}
				{nestedProperties?.length > 0 ? (
					<div className={s.nestedPropertyNestedList}>
						<NestedProperties
							nestedProperties={nestedProperties}
							depth={depth}
						/>
					</div>
				) : null}
			</div>
		</div>
	)
}
