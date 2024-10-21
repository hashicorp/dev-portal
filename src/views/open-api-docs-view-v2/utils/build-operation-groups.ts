/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

interface OperationGroup {
	title: string
	operationObjects: $TSFixMe
}

/**
 * TODO: implement properly and add comments,
 * messing around for now.
 */
export function buildOperationGroups(
	operationGroupings: $TSFixMe,
	operationObjects: $TSFixMe
): OperationGroup[] {
	const operationGroups: OperationGroup[] = []
	//
	for (const { title, operationIds } of operationGroupings) {
		/**
		 * Match each operationId to an operation object
		 * If given operationId doesn't have a match... error? warn?
		 */
		const matchedOperationObjects = []
		for (const operationId of operationIds) {
			const matchedOperationObject = operationObjects.find(
				(operationObject) => operationObject.operationId === operationId
			)
			console.log({ operationId, matchedOperationObject })
			if (matchedOperationObject) {
				matchedOperationObjects.push(matchedOperationObject)
			} else {
				console.error(
					`No operation object found for operationId: ${operationId}. Skipping.`
				)
			}
		}
		//
		if (matchedOperationObjects.length === 0) {
			console.error(
				`No operation objects found for group: ${title}. Skipping group.`
			)
		} else {
			operationGroups.push({ title, operationObjects: matchedOperationObjects })
		}
	}
	// Gather ids from all operation groups
	const allUsedOperationIds = operationGroups.reduce(
		(acc, group) =>
			acc.concat(group.operationObjects.map((obj) => obj.operationId)),
		[]
	)
	// Check for any operation objects that weren't used
	const unusedOperationObjects = operationObjects.filter(
		(obj) => !allUsedOperationIds.includes(obj.operationId)
	)
	/**
	 * If we have operation objects that were not included in a group,
	 * create an "Other" group to hold any unused operation objects.
	 */
	if (unusedOperationObjects.length > 0) {
		operationGroups.push({
			title: 'Other', // TODO: make this configurable? Arg with default value?
			operationObjects: unusedOperationObjects,
		})
	}
	//
	return operationGroups
}
