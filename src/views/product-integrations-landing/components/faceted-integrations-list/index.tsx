import React from 'react'
import s from './style.module.css'

interface FacetCheckboxProps {
	label: string
	isChecked: boolean
	onChange: (e: React.FormEvent<HTMLInputElement>) => void
	matching?: number
	icon?: React.ReactNode
}

export function FacetCheckbox({
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
