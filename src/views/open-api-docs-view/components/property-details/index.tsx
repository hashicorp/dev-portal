/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { MdxInlineCode } from 'components/dev-dot-content/mdx-components'
import Badge from 'components/badge'
import { IconCornerDownRight16 } from '@hashicorp/flight-icons/svg-react/corner-down-right-16'
import s from './property-details.module.css'

/**
 * Types are shared by the "base" and "deeper" variations of
 * the property details component.
 */
export type PropertyDetailsProps = {
	name: string
	type: string
	isRequired?: boolean
	description?: string // Plain text or HTML
	nestedProperties?: PropertyDetailsProps[]
	depth?: number
}

/**
 * Render a top-level property, with optional nested properties.
 *
 * Future: will need to support "beta" badge for HCP Packer docs.
 */
export function PropertyDetails({
	name,
	type,
	isRequired,
	description,
	nestedProperties,
	depth = 0,
}: PropertyDetailsProps) {
	return (
		<div className={s.baseRoot}>
			<div className={s.baseMetaAndDescription}>
				<div className={s.baseMeta}>
					<MdxInlineCode>{name}</MdxInlineCode>
					<span className={s.baseType}>{type}</span>
					{isRequired ? <Badge text="Required" color="highlight" /> : null}
				</div>
				{description ? (
					<div
						className={s.baseDescription}
						dangerouslySetInnerHTML={{ __html: description }}
					/>
				) : null}
			</div>
			{nestedProperties?.length > 0 ? (
				<>
					<hr className={s.baseNestedDivider} />
					<ListNestedProperties
						nestedProperties={nestedProperties}
						depth={depth}
					/>
				</>
			) : null}
		</div>
	)
}

/**
 * Render a list of nested properties within a base property.
 */
function ListNestedProperties({
	nestedProperties,
	depth,
}: Pick<PropertyDetailsProps, 'nestedProperties' | 'depth'>) {
	return (
		<ul className={s.listNestedProperties}>
			{nestedProperties.map((nestedProperty) => {
				return (
					<li key={`${nestedProperty.name}_${depth}`}>
						<PropertyDetailsNested {...nestedProperty} depth={depth + 1} />
					</li>
				)
			})}
		</ul>
	)
}

/**
 * Renders details for a property nested within another property.
 *
 * Future: will need to support "beta" badge for HCP Packer docs.
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
		<div className={classNames(s.nestedRoot, s[`depth-${depth}`])}>
			<div className={s.nestedMetaAndDescription}>
				<div className={s.nestedMeta}>
					<IconCornerDownRight16 className={s.nestedIcon} />
					<div className={s.nestedNameAndType}>
						<code className={s.nestedName}>{name}</code>
						<span className={s.nestedType}>{type}</span>
					</div>
					{isRequired ? (
						<Badge text="Required" color="highlight" size="small" />
					) : null}
				</div>
				{description ? (
					<div
						className={s.nestedDescription}
						dangerouslySetInnerHTML={{ __html: description }}
					/>
				) : null}
			</div>
			{nestedProperties?.length > 0 ? (
				<div className={s.nestedBody}>
					<ListNestedProperties
						nestedProperties={nestedProperties}
						depth={depth}
					/>
				</div>
			) : null}
		</div>
	)
}
