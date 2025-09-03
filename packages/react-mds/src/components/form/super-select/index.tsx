'use client'

import { useId } from 'react'
import classNames from 'classnames'
import { Field } from '../field'
import { FlightIcon } from '../../flight-icon'
import {
	ComboBox,
	ComboBoxListProps,
} from '@hashicorp/react-mds/src/components/combo-box-primitive'
import type {
	TComboBoxItem,
	ComboBoxSearchInputProps,
} from '@hashicorp/react-mds/src/components/combo-box-primitive'
import type { FieldProps } from '../field'
import s from './form-super-select.module.css'

type SuperSelectRootProps = {
	children: React.ReactNode
	onChangeSelectedOption?: (option: TComboBoxItem) => void
	onChangeVFocusedOption?: (option: TComboBoxItem) => void
}

const SuperSelectRoot = ({
	children,
	onChangeSelectedOption,
	onChangeVFocusedOption,
}: SuperSelectRootProps) => {
	return (
		<ComboBox.Root
			onChangeSelectedOption={onChangeSelectedOption}
			onChangeVFocusedOption={onChangeVFocusedOption}
		>
			<div className={s.root}>{children}</div>
		</ComboBox.Root>
	)
}

interface SuperSelectTriggerProps {
	className?: string
}

const SuperSelectTrigger = ({ className }: SuperSelectTriggerProps) => {
	return (
		<ComboBox.Trigger className={classNames(s.trigger, className)}>
			<ComboBox.Value />
		</ComboBox.Trigger>
	)
}

type SuperSelectPopoverProps = {
	children: React.ReactNode
}

const SuperSelectPopover = ({ children }: SuperSelectPopoverProps) => {
	return <ComboBox.Popover className={s.popover}>{children}</ComboBox.Popover>
}

type SuperSelectSearchInputProps = ComboBoxSearchInputProps

const SuperSelectSearchInput = ({
	placeholder = 'Search',
	value,
	onChange,
	onBlur,
}: SuperSelectSearchInputProps) => {
	return (
		<div className={s['search-input-wrapper']}>
			<ComboBox.SearchInput
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
			/>
		</div>
	)
}

type SuperSelectListProps = ComboBoxListProps

const SuperSelectList = ({
	label,
	children,
	className,
	maxHeight,
	onScroll,
}: SuperSelectListProps) => {
	return (
		<ComboBox.List
			label={label}
			className={classNames(s.list, className)}
			maxHeight={maxHeight}
			onScroll={onScroll}
		>
			{children}
		</ComboBox.List>
	)
}

interface SuperSelectOptionProps extends TComboBoxItem {
	isLoading?: boolean
	/**
	 * Leading icon. Acceptable value: any [icon](https://helios.hashicorp.design/icons/library) name.
	 */
	icon?: string
	/**
	 * Trailing icon. Acceptable value: any [icon](https://helios.hashicorp.design/icons/library) name.
	 */
	trailingIcon?: string
	className?: string
}

const SuperSelectOption = ({
	value,
	label,
	isLoading,
	icon,
	className,
	trailingIcon,
}: SuperSelectOptionProps) => {
	return (
		<ComboBox.Item
			value={value}
			label={label}
			className={classNames(s.option, className)}
		>
			{isLoading ? (
				<div className={s['interactive-loading-wrapper']}>
					<div
						className={classNames(
							s['interactive-icon'],
							s['interactive-icon-leading']
						)}
					>
						<FlightIcon name="loading" isInlineBlock={false} />
					</div>
					<span className={s['option-text']}>{label}</span>
				</div>
			) : (
				<>
					{icon && (
						<span
							className={classNames(
								s['interactive-icon'],
								s['interactive-icon-leading']
							)}
						>
							<FlightIcon name={icon} isInlineBlock={false} />
						</span>
					)}
					<span className={s['option-text']}>{label}</span>
					{trailingIcon && (
						<span
							className={classNames(
								s['interactive-icon'],
								s['interactive-icon-trailing']
							)}
						>
							<FlightIcon name={trailingIcon} isInlineBlock={false} />
						</span>
					)}
				</>
			)}
		</ComboBox.Item>
	)
}

type TSuperSelectOption = TComboBoxItem

const SuperSelect = Object.freeze({
	Root: SuperSelectRoot,
	Trigger: SuperSelectTrigger,
	Popover: SuperSelectPopover,
	/**
	 * Note that this only acts as a view layer,
	 * it does not participate in the search logic.
	 * This is left for the consumer to implement.
	 */
	SearchInput: SuperSelectSearchInput,
	List: SuperSelectList,
	Option: SuperSelectOption,
})

interface SuperSelectFieldProps
	extends Omit<FieldProps, 'children' | 'id' | 'layout'> {
	id?: string
	options: SuperSelectOptionProps[]
	/**
	 * @default false
	 */
	searchProps?: SuperSelectSearchInputProps
	/**
	 * Used for assistive technologies,
	 * indicate the category of options you are presenting
	 * eg. Schools | Languages | Countries
	 */
	listLabel: string
	/**
	 * Is actually a `max-height` for the list.
	 * Pass this when you have a lot of options and want to limit the height of the list.
	 * @default `240px`
	 */
	listHeight?: `${number}em` | `${number}px` | `${number}%`
	/**
	 * Callback for when the list is scrolled.
	 * This is useful for implementing pagination, recommended for large lists.
	 */
	onScroll?: (e: React.UIEvent<HTMLUListElement>) => void
	onChangeSelectedOption?: (option: SuperSelectOptionProps) => void
	onChangeVFocusedOption?: (option: SuperSelectOptionProps) => void
	onSearchBlur?: () => void
}

/**
 * Convenience component for using {@link SuperSelect}
 * with a {@link Field} component. This should cover most use cases
 * unless you need advanced patterns like pagination, async options, etc. outside of a form context.
 */
const SuperSelectField = ({
	label,
	helperText,
	error,
	id,
	searchProps,
	options,
	listLabel,
	listHeight = '240px',
	onScroll,
	onChangeSelectedOption,
	onChangeVFocusedOption,
	onSearchBlur,
	...rest
}: SuperSelectFieldProps) => {
	const genID = useId()
	const fieldId = id ?? genID

	return (
		<Field
			label={label}
			helperText={helperText}
			error={error}
			id={fieldId}
			layout={'vertical'}
			{...rest}
		>
			<SuperSelect.Root
				onChangeSelectedOption={onChangeSelectedOption}
				onChangeVFocusedOption={onChangeVFocusedOption}
			>
				<SuperSelect.Trigger />
				<SuperSelect.Popover>
					{searchProps && (
						<SuperSelect.SearchInput
							placeholder={searchProps.placeholder}
							value={searchProps.value}
							onChange={searchProps.onChange}
							onBlur={onSearchBlur}
						/>
					)}
					<SuperSelect.List
						label={listLabel}
						maxHeight={listHeight}
						onScroll={onScroll}
					>
						{options.map((option) => (
							<SuperSelect.Option key={option.value} {...option} />
						))}
					</SuperSelect.List>
				</SuperSelect.Popover>
			</SuperSelect.Root>
		</Field>
	)
}

export type {
	TSuperSelectOption,
	SuperSelectOptionProps,
	SuperSelectSearchInputProps,
}

export { SuperSelectField }
