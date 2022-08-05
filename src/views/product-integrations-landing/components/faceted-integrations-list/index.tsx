import s from './style.module.css'
import { useState } from 'react'

import SearchableIntegrationsList from '../searchable-integrations-list'

export default function FacetedIntegrationList({ integrations }) {
	// Tier Values
  const [officialChecked, setOfficialChecked] = useState(false);
  const [verifiedChecked, setVerifiedChecked] = useState(false);
  const [communityChecked, setCommunityChecked] = useState(false);

	// Figure out the list of tiers we want to display as filters
	// based off of the integrations list that we are passed. If there
	// are no community integrations passed, we simply won't display
	// that checkbox.
	const tierOptions = Array.from(new Set(integrations.map((i) => i.tier)))

	// Pull out the list of all of the categories used by our integrations
	// and sort them alphabetically so they are deterministically ordered.
	const allCategories = integrations.map((i) => i.categories)
	const mergedCategories = [].concat.apply([], allCategories);
	const categoryIDs = mergedCategories.map(c => c.id)
	const dedupedCategories = mergedCategories.filter(({id}, index) => !categoryIDs.includes(id, index + 1))
	const sortedCategories = dedupedCategories.sort((a, b) => {
    var textA = a.name.toLowerCase();
    var textB = b.name.toLowerCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
	});

	// We have to manage our category checked state in a singular
	// state object as there are an unknown number of categories.
	const [categoryCheckedArray, setCategoryCheckedArray] = useState(
		new Array(sortedCategories.length).fill(false)
	);
	console.log(categoryCheckedArray)

	return (
		<div className={s.facetedIntegrationList}>
			<div className={s.facetsSidebar}>

				<h5 className={s.facetCategoryTitle}>Tier</h5>
				{tierOptions.includes('official') && (
					<FacetCheckbox
						label="Official"
						checked={officialChecked}
						onChange={(e) => setOfficialChecked(!officialChecked)}
					/>
				)}
				{tierOptions.includes('verified') && (
					<FacetCheckbox
						label="Verified"
						checked={verifiedChecked}
						onChange={(e) => setVerifiedChecked(!verifiedChecked)}
					/>
				)}
				{!tierOptions.includes('community') && (
					<FacetCheckbox
						label="Community"
						checked={communityChecked}
						onChange={(e) => setCommunityChecked(!communityChecked)}
					/>
				)}

				<h5 className={s.facetCategoryTitle}>Category</h5>
				{sortedCategories.map((category, index) => {
					return (
						<FacetCheckbox
							key={category.id}
							label={category.name}
							checked={categoryCheckedArray[index]}
							onChange={(e) => setCategoryCheckedArray(
								categoryCheckedArray.map((v, i) => {
									return i === index ? !v : v
								})
							)}
						/>
					)
				})}
			</div>
			<SearchableIntegrationsList integrations={integrations} />
		</div>
	)
}

function FacetCheckbox({label, isChecked, onChange}) {
	const labelID = label.toLowerCase().trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');

	return (
		<div className={s.facetCheckbox}>
			<input
				id={labelID}
				type="checkbox"
				checked={isChecked}
				onChange={onChange}
			/>
			<label for={labelID}>{label}</label>
		</div>
	)
}
