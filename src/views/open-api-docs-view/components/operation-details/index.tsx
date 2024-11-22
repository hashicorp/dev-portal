/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Components
import Badge from 'components/badge'
// Local components
import { ContentWithPermalink } from '../content-with-permalink'
import { PropertyDetails } from '../property-details'
// Types
import type { PropertyDetailsProps } from '../property-details'
// Styles
import s from './operation-details.module.css'

export interface PropertyDetailsGroup {
	heading: {
		text: string
		slug: string
		/**
		 * If `theme` is provided, we render a badge with that theme.
		 */
		theme?: 'success' | 'neutral' | 'critical'
	}
	propertyDetails: PropertyDetailsProps[]
}

export interface PropertyDetailsSectionProps {
	heading: {
		text: string
		slug: string
	}
	groups: PropertyDetailsGroup[]
	noGroupsMessage: string
}

/**
 * Render request and response data for an operation.
 */
export function OperationDetails({
	requestData,
	responseData,
}: {
	requestData: PropertyDetailsSectionProps
	responseData: PropertyDetailsSectionProps
}) {
	return (
		<div className={s.root}>
			<PropertyDetailsSection
				heading={requestData.heading}
				groups={requestData.groups}
				noGroupsMessage={requestData.noGroupsMessage}
			/>
			<PropertyDetailsSection
				heading={responseData.heading}
				groups={responseData.groups}
				noGroupsMessage={responseData.noGroupsMessage}
			/>
		</div>
	)
}

/**
 * Render a section with many groups of property details.
 *
 * Used to show request and response details for operations
 */
function PropertyDetailsSection({
	heading,
	groups,
	noGroupsMessage,
}: PropertyDetailsSectionProps) {
	return (
		<div className={s.section}>
			<ContentWithPermalink id={heading.slug} ariaLabel={heading.text}>
				<h4 id={heading.slug} className={s.sectionHeading}>
					{heading.text}
				</h4>
			</ContentWithPermalink>
			{groups.length > 0 ? (
				<div className={s.sectionGroups}>
					{groups.map((group) => {
						return (
							<div className={s.group} key={group.heading.slug}>
								<ContentWithPermalink
									id={group.heading.slug}
									ariaLabel={group.heading.text}
								>
									<h5 id={group.heading.slug} className={s.groupHeading}>
										{group.heading.theme ? (
											<Badge
												type="outlined"
												text={group.heading.text}
												color={group.heading.theme}
											/>
										) : (
											group.heading.text
										)}
									</h5>
								</ContentWithPermalink>
								<div className={s.groupProperties}>
									{group.propertyDetails.map((property) => {
										return <PropertyDetails key={property.name} {...property} />
									})}
								</div>
							</div>
						)
					})}
				</div>
			) : (
				<div className={s.noGroupsMessage}>{noGroupsMessage}</div>
			)}
		</div>
	)
}
