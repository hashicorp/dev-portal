import { ChangeEvent, ReactElement, useRef } from 'react'
import classNames from 'classnames'
import { IconFilter16 } from '@hashicorp/flight-icons/svg-react/filter-16'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import s from './filter-input.module.css'

interface FilterInputProps {
	placeholder?: string
	value: string
	onChange: (newValue: string) => void
	className?: string
}

const FilterInput = ({
	placeholder = 'Filter',
	value,
	onChange,
	className,
}: FilterInputProps): ReactElement => {
	const inputRef = useRef<HTMLInputElement>()
	const showClearButton = value

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value
		onChange(newValue)
	}

	const handleClear = () => {
		onChange('')
		inputRef.current.focus()
	}

	return (
		<div className={classNames(s.filterInputContainer, className)}>
			<IconFilter16 className={s.filterIcon} />
			<input
				className={s.filterInput}
				onChange={handleChange}
				placeholder={placeholder}
				ref={inputRef}
				value={value}
				autoComplete="off"
				autoCorrect="off"
				autoCapitalize="none"
				spellCheck="false"
			/>
			{showClearButton && (
				<button
					aria-label="Clear filter"
					className={s.clearButton}
					onClick={handleClear}
				>
					<IconX16 className={s.clearIcon} />
				</button>
			)}
		</div>
	)
}

export default FilterInput
