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

/**
 * Render request and response data for an operation.
 */
export function OperationDetails({
	requestData,
	responseData,
}: {
	requestData: PropertyDetailsGroup[]
	responseData: PropertyDetailsGroup[]
}) {
	return (
		<div className={s.root}>
			<PropertyDetailsSection
				heading={{ text: 'Request', slug: 'request' }}
				groups={requestData}
				noGroupsMessage="No request data."
			/>
			<PropertyDetailsSection
				heading={{ text: 'Response', slug: 'response' }}
				groups={responseData}
				noGroupsMessage="No response data."
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
}: {
	heading: {
		text: string
		slug: string
	}
	groups: PropertyDetailsGroup[]
	noGroupsMessage: string
}) {
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
