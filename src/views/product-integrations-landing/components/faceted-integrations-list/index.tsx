import s from './style.module.css'
import React, { useState } from 'react'
import { IconAward16 } from '@hashicorp/flight-icons/svg-react/award-16'
import { IconCheckCircle16 } from '@hashicorp/flight-icons/svg-react/check-circle-16'
import Button from '@hashicorp/react-button'
import SearchableIntegrationsList from '../searchable-integrations-list'

export default function FacetedIntegrationList({ integrations }) {
	// Tier Values
	const [officialChecked, setOfficialChecked] = useState(false)
	const [verifiedChecked, setVerifiedChecked] = useState(false)
	const [communityChecked, setCommunityChecked] = useState(false)

	// Filter out integrations that don't have releases yet
	let filteredIntegrations = integrations
	filteredIntegrations = filteredIntegrations.filter((integration) => {
		return integration.versions && integration.versions.length > 0
	})

	// Figure out the list of tiers we want to display as filters
	// based off of the integrations list that we are passed. If there
	// are no community integrations passed, we simply won't display
	// that checkbox.
	const tierOptions = Array.from(
		new Set(filteredIntegrations.map((i) => i.tier))
	)

	// Calculate the number of integrations that match each tier
	const matchingOfficial = filteredIntegrations.filter(
		(i) => i.tier === 'official'
	).length
	const matchingVerified = filteredIntegrations.filter(
		(i) => i.tier === 'verified'
	).length
	const matchingCommunity = filteredIntegrations.filter(
		(i) => i.tier === 'community'
	).length

	// Pull out the list of all of the components used by our integrations
	// and sort them alphabetically so they are deterministically ordered.
	const allComponents = filteredIntegrations.map((i) => i.components)
	// eslint-disable-next-line prefer-spread
	const mergedComponents = [].concat.apply([], allComponents)

	const componentIDs = mergedComponents.map((c) => c.id)
	const dedupedComponents = mergedComponents.filter(
		({ id }, index) => !componentIDs.includes(id, index + 1)
	)
	const sortedComponents = dedupedComponents
		.sort((a, b) => {
			const textA = a.name.toLowerCase()
			const textB = b.name.toLowerCase()
			return textA < textB ? -1 : textA > textB ? 1 : 0
		})
		.map((component) => {
			// Add # of occurances to the component object for facets
			component.occurances = mergedComponents.filter(
				(c) => c.slug === component.slug
			).length
			return component
		})

	// We have to manage our component checked state in a singular
	// state object as there are an unknown number of components.
	const [componentCheckedArray, setComponentCheckedArray] = useState(
		new Array(sortedComponents.length).fill(false)
	)

	// Now filter our integrations if facets are selected
	const atLeastOneFacetSelected =
		officialChecked ||
		verifiedChecked ||
		communityChecked ||
		componentCheckedArray.includes(true)
	if (atLeastOneFacetSelected) {
		filteredIntegrations = filteredIntegrations.filter((integration) => {
			// Default tierMatch to true if nothing is checked, false otherwise
			let tierMatch = !officialChecked && !verifiedChecked && !communityChecked
			if (officialChecked && integration.tier === 'official') {
				tierMatch = true
			}
			if (verifiedChecked && integration.tier === 'verified') {
				tierMatch = true
			}
			if (communityChecked && integration.tier === 'community') {
				tierMatch = true
			}

			// Loop over each component to see if they match any checked components
			// If there are no components selected, default this to true
			let componentMatch = !componentCheckedArray.includes(true)
			componentCheckedArray.forEach((checked, index) => {
				if (checked) {
					const checkedComponent = sortedComponents[index]
					// Check each integration component
					for (const component of integration.components) {
						if (component.slug === checkedComponent.slug) {
							componentMatch = true
						}
					}
				}
			})
			return tierMatch && componentMatch
		})
	}

	return (
		<div className={s.facetedIntegrationList}>
			<div className={s.facetsSidebar}>
				<h5 className={s.facetCategoryTitle}>Tier</h5>
				{tierOptions.includes('official') && (
					<FacetCheckbox
						label="Official"
						icon={<IconAward16 className={s.awardIcon} />}
						matching={matchingOfficial}
						isChecked={officialChecked}
						onChange={(e) => setOfficialChecked(!officialChecked)}
					/>
				)}
				{tierOptions.includes('verified') && (
					<FacetCheckbox
						label="Verified"
						icon={<IconCheckCircle16 className={s.checkIcon} />}
						matching={matchingVerified}
						isChecked={verifiedChecked}
						onChange={(e) => setVerifiedChecked(!verifiedChecked)}
					/>
				)}
				{tierOptions.includes('community') && (
					<FacetCheckbox
						label="Community"
						matching={matchingCommunity}
						isChecked={communityChecked}
						onChange={(e) => setCommunityChecked(!communityChecked)}
					/>
				)}

				<h5 className={s.facetCategoryTitle}>Component</h5>
				{sortedComponents.map((component, index) => {
					return (
						<FacetCheckbox
							key={component.id}
							label={component.plural_name}
							matching={component.occurances}
							isChecked={componentCheckedArray[index]}
							onChange={(e) =>
								setComponentCheckedArray(
									componentCheckedArray.map((v, i) => {
										return i === index ? !v : v
									})
								)
							}
						/>
					)
				})}

				{atLeastOneFacetSelected && (
					<Button
						className={s.resetFilters}
						title="Reset filters"
						size="small"
						onClick={(e) => {
							setOfficialChecked(false)
							setVerifiedChecked(false)
							setCommunityChecked(false)
							setComponentCheckedArray(
								componentCheckedArray.map((v, i) => {
									return false
								})
							)
						}}
					/>
				)}
			</div>
			<SearchableIntegrationsList
				className={s.searchList}
				integrations={filteredIntegrations}
			/>
		</div>
	)
}

interface FacetCheckboxProps {
	label: string
	isChecked: boolean
	onChange: (e: React.FormEvent<HTMLInputElement>) => void
	matching?: number
	icon?: React.ReactNode
}

function FacetCheckbox({
	label,
	isChecked,
	onChange,
	icon,
	matching,
}: FacetCheckboxProps) {
	const labelID = label
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '')
	return (
		<div className={s.facetCheckbox}>
			<input
				id={labelID}
				type="checkbox"
				checked={isChecked}
				onChange={onChange}
			/>
			<label htmlFor={labelID}>
				{icon ? icon : ''}
				{label}
				{matching > 0 && <span className={s.matching}>({matching})</span>}
			</label>
		</div>
	)
}
