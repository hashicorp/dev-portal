/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third party
import type { PropsWithChildren } from 'react'
import classNames from 'classnames'
// HDS
import { IconCornerDownRight16 } from '@hashicorp/flight-icons/svg-react/corner-down-right-16'
// Components
import { MdxInlineCode } from 'components/dev-dot-content/mdx-components'
import Badge from 'components/badge'
// Styles
import s from './property-details.module.css'

/**
 * Types are shared by the "base" and "deeper" variations of
 * the property details component.
 */
export interface PropertyDetailsProps {
	name: string
	type: string
	isRequired?: boolean
	description?: string // Plain text or HTML
	nestedProperties?: PropertyDetailsProps[]
	depth?: number
	isLastItem?: boolean
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
	const hasNestedProperties = nestedProperties?.length > 0
	return (
		<div className={s.baseRoot}>
			<div className={s.baseMetaAndDescription}>
				<div className={s.baseMeta}>
					<MdxInlineCode>{name}</MdxInlineCode>
					<span className={s.baseType}>{type}</span>
					{isRequired ? <Badge text="Required" color="highlight" /> : null}
				</div>
			</div>
			{description || hasNestedProperties ? (
				<div className={s.baseBody}>
					{description ? (
						<ItemWithNestingIndicator
							listItemStyle={!hasNestedProperties ? 'last' : null}
							hideIndicator={!hasNestedProperties}
						>
							<div
								className={classNames(s.baseDescription, {
									[s.hasNestedProperties]: hasNestedProperties,
								})}
								dangerouslySetInnerHTML={{ __html: description }}
							/>
						</ItemWithNestingIndicator>
					) : null}

					{hasNestedProperties ? (
						<ListNestedProperties
							nestedProperties={nestedProperties}
							depth={depth}
						/>
					) : null}
				</div>
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
			{nestedProperties.map((nestedProperty, idx) => {
				const isLastItem = idx === nestedProperties.length - 1
				return (
					<li key={`${nestedProperty.name}_${depth}`}>
						<PropertyDetailsNested
							{...nestedProperty}
							depth={depth + 1}
							isLastItem={isLastItem}
						/>
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
	isLastItem,
}: PropertyDetailsProps) {
	const hasNestedProperties = nestedProperties?.length > 0
	return (
		<div className={classNames(s.nestedRoot, s[`depth-${depth}`])}>
			<ItemWithNestingIndicator listItemStyle={isLastItem ? 'last' : 'middle'}>
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
			</ItemWithNestingIndicator>

			{description || hasNestedProperties ? (
				<ItemWithNestingIndicator hideBorder={isLastItem}>
					<div className={s.nestedBody}>
						{description ? (
							<ItemWithNestingIndicator
								listItemStyle={!hasNestedProperties ? 'last' : null}
								hideIndicator={!hasNestedProperties}
							>
								<div
									className={s.nestedDescription}
									dangerouslySetInnerHTML={{ __html: description }}
								/>
							</ItemWithNestingIndicator>
						) : null}
						{hasNestedProperties ? (
							<ListNestedProperties
								nestedProperties={nestedProperties}
								depth={depth}
							/>
						) : null}
					</div>
				</ItemWithNestingIndicator>
			) : null}
		</div>
	)
}

/**
 * TODO: write description
 */
function ItemWithNestingIndicator({
	children,
	listItemStyle,
	hideBorder,
	hideIndicator,
}: PropsWithChildren<{
	listItemStyle?: 'middle' | 'last'
	hideBorder?: boolean
	hideIndicator?: boolean
}>) {
	return (
		<div className={s.itemWithNestingIndicator}>
			<div
				className={classNames(s.nestingIndicatorContainer, {
					[s.hideIndicator]: hideIndicator,
				})}
			>
				<div
					className={classNames(s.nestingIndicator, {
						[s.isLastItem]: listItemStyle === 'last',
						[s.isMiddleItem]: listItemStyle === 'middle',
						[s.hideBorder]: hideBorder,
					})}
				/>
			</div>
			<div>{children}</div>
		</div>
	)
}
