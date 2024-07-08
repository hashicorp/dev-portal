/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third party
import type { PropsWithChildren } from 'react'
import classNames from 'classnames'
// Components
import { MdxInlineCode } from 'components/dev-dot-content/mdx-components'
import Badge from 'components/badge'
// Styles
import s from './property-details.module.css'
import { ContentWithPermalink } from '../content-with-permalink'

/**
 * Types are shared by the "base" and "nested" variations of
 * the property details component.
 */
export interface PropertyDetailsProps {
	name: string
	slug: string
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
	slug,
	type,
	isRequired,
	description,
	nestedProperties,
	depth = 0,
}: PropertyDetailsProps) {
	const hasNestedProperties = nestedProperties?.length > 0
	return (
		<div id={slug} className={s.baseRoot}>
			<div className={s.baseMetaAndDescription}>
				<ContentWithPermalink id={slug} ariaLabel={name}>
					<div className={s.baseMeta}>
						<MdxInlineCode>{name}</MdxInlineCode>
						<span className={s.baseType}>{type}</span>
						{isRequired ? <Badge text="Required" color="highlight" /> : null}
					</div>
				</ContentWithPermalink>
			</div>
			{description || hasNestedProperties ? (
				<div>
					{description ? (
						<TreeContent
							listItemStyle={!hasNestedProperties ? 'last' : null}
							hideIndicator={!hasNestedProperties}
						>
							<div
								className={classNames(s.baseDescription, {
									[s.hasNestedProperties]: hasNestedProperties,
								})}
								dangerouslySetInnerHTML={{ __html: description }}
							/>
						</TreeContent>
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
	slug,
	type,
	isRequired,
	description,
	nestedProperties,
	depth = 0,
	isLastItem,
}: PropertyDetailsProps) {
	const hasNestedProperties = nestedProperties?.length > 0
	return (
		<div id={slug} className={s.nestedRoot}>
			{/* Meta row */}
			<TreeContent listItemStyle={isLastItem ? 'last' : 'middle'}>
				<ContentWithPermalink id={slug} ariaLabel={name}>
					<div className={s.nestedMeta}>
						<div className={s.nestedNameAndType}>
							<code className={s.nestedName}>{name}</code>
							<span className={s.nestedType}>{type}</span>
						</div>
						{isRequired ? (
							<Badge text="Required" color="highlight" size="small" />
						) : null}
					</div>
				</ContentWithPermalink>
			</TreeContent>
			{/* Optional description and nested properties */}
			{description || hasNestedProperties ? (
				<TreeContent hideBorder={isLastItem}>
					{description ? (
						<TreeContent
							listItemStyle={!hasNestedProperties ? 'last' : null}
							hideIndicator={!hasNestedProperties}
						>
							<div
								className={s.nestedDescription}
								dangerouslySetInnerHTML={{ __html: description }}
							/>
						</TreeContent>
					) : null}
					{hasNestedProperties ? (
						<ListNestedProperties
							nestedProperties={nestedProperties}
							depth={depth}
						/>
					) : null}
				</TreeContent>
			) : null}
		</div>
	)
}

/**
 * Display `children` with structured tree styles, including tree markers.
 *
 * Accepts optional props that affect the appearance of the tree styles:
 * - `hideBorder` - hide the tree marker, but retain spacing
 * - `hideIndicator` - hide the tree marker, which shifts positioning,
 *    and removes the consistent left padding.
 * - `listItemStyle` - affects the tree marker style. By default,
 *    the marker is a vertical line that extends to the bottom of the
 * 	  container, creating the appearance of a continuous line for
 * 		consecutive list items. The `middle` style adds a horizontal line,
 *    which points to the children. The `last` style curves the vertical line
 *    and ends it by pointing to the children.
 */
function TreeContent({
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
		<div
			className={classNames(s.treeContent, {
				[s.hideIndicator]: hideIndicator,
			})}
		>
			{hideIndicator ? null : (
				<div className={s.treeIndicatorContainer}>
					<div
						className={classNames(s.treeIndicator, {
							[s.isLastItem]: listItemStyle === 'last',
							[s.isMiddleItem]: listItemStyle === 'middle',
							[s.hideBorder]: hideBorder,
						})}
					/>
				</div>
			)}
			<div className={s.treeChildren}>{children}</div>
		</div>
	)
}
