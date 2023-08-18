/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ContentWithPermalink } from '../content-with-permalink'
import { PropertyDetails, PropertyDetailsProps } from '../property-details'
import s from './operation-details.module.css'

export interface PropertyDetailsGroup {
	heading: {
		text: string
		slug: string
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
										{group.heading.text}
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
