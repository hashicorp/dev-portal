import classNames from 'classnames'
import {
	createElement,
	type ComponentPropsWithRef,
	type ElementType,
	type ReactNode,
} from 'react'
import s from './style.module.scss'

const TEXT_COLORS = [
	'primary',
	'strong',
	'faint',
	'disabled',
	'high-contrast',
	'action',
	'action-hover',
	'action-active',
	'highlight',
	'highlight-on-surface',
	'highlight-high-contrast',
	'success',
	'success-on-surface',
	'success-high-contrast',
	'warning',
	'warning-on-surface',
	'warning-high-contrast',
	'critical',
	'critical-on-surface',
	'critical-high-contrast',
] as const

const TEXT_GROUPS = [
	'hds-body',
	'code',
	'display',
	'body',
	'display-expressive',
	'label',
] as const

const TEXT_SIZES = [
	'100',
	'200',
	'300',
	'400',
	'500',
	'600',
	'700',
	'800',
] as const

const TEXT_WEIGHTS = ['regular', 'medium', 'semibold', 'bold'] as const

type TextColor = (typeof TEXT_COLORS)[number]
type TextWeight = (typeof TEXT_WEIGHTS)[number]
type TextGroup = (typeof TEXT_GROUPS)[number]
type TextSize = (typeof TEXT_SIZES)[number]

// small typescript hack to support autocomplete and arbitrary strings
type HexColor = string & { hexish?: unknown }

interface BaseTextProps<T extends ElementType> {
	tag?: T
	size?: TextSize
	weight?: TextWeight
	align?: 'left' | 'center' | 'right'
	color?: TextColor | HexColor
	children: ReactNode
	className?: string
}

interface TextImplProps<T extends ElementType> extends BaseTextProps<T> {
	group: TextGroup
}

function getTypographyToken(group: TextGroup, size: TextSize): string {
	const groupToTokenMap: Record<TextGroup, string> = {
		'hds-body': `token-typography-body-${size}`,
		code: `mds-typography-code-${size}`,
		display: `mds-typography-display-${size}`,
		'display-expressive': `mds-typography-display-expressive-${size}`,
		label: `mds-typography-label`,
		body: `mds-typography-body-${size}`,
	}

	return groupToTokenMap[group]
}

const TextImpl = <T extends ElementType = 'span'>({
	tag,
	group,
	size = '200',
	weight,
	align,
	color,
	children,
	className,
	...rest
}: TextImplProps<T> &
	Omit<ComponentPropsWithRef<T>, keyof TextImplProps<T>>) => {
	const Component = tag ?? 'span'
	const variant = getTypographyToken(group, size)

	const usesPredefinedColor = TEXT_COLORS.includes(color as TextColor)

	return (
		<Component
			className={classNames(
				variant,
				{
					[s[`align-${align}`]]: align,
					[`mds-typography-font-weight-${weight}`]: weight,
					[`token-foreground-${color}`]: color && usesPredefinedColor,
				},
				className
			)}
			style={color && !usesPredefinedColor ? { color } : {}}
			{...rest}
		>
			{children}
		</Component>
	)
}

interface BodyProps<T extends ElementType> extends BaseTextProps<T> {
	size?: '200' | '300' | '400'
}

const Body = <T extends ElementType>({
	size = '300',
	...rest
}: BodyProps<T> & Omit<ComponentPropsWithRef<T>, keyof BodyProps<T>>) => {
	return createElement(TextImpl, {
		...rest,
		size,
		group: 'body',
	})
}

interface DisplayExpressiveProps<T extends ElementType>
	extends BaseTextProps<T> {
	size?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800'
}

const DisplayExpressive = <T extends ElementType>({
	size = '200',
	...rest
}: DisplayExpressiveProps<T> &
	Omit<ComponentPropsWithRef<T>, keyof DisplayExpressiveProps<T>>) => {
	return createElement(TextImpl, {
		...rest,
		size,
		group: 'display-expressive',
	})
}

type LabelProps<T extends ElementType> = Omit<BaseTextProps<T>, 'size'>

const Label = <T extends ElementType>(
	props: LabelProps<T> & Omit<ComponentPropsWithRef<T>, keyof LabelProps<T>>
) => {
	return createElement(TextImpl, {
		...props,
		group: 'label',
	})
}

interface DisplayProps<T extends ElementType> extends BaseTextProps<T> {
	size?: '100' | '200' | '300' | '400' | '500'
}

const Display = <T extends ElementType>({
	size = '200',
	weight,
	...rest
}: DisplayProps<T> & Omit<ComponentPropsWithRef<T>, keyof DisplayProps<T>>) => {
	const defaultWeightsPerSize = {
		'500': 'bold',
		'400': 'semibold',
		'300': 'semibold',
		'200': 'semibold',
		'100': 'medium',
	} as const

	return createElement(TextImpl, {
		...rest,
		size,
		weight: weight ?? defaultWeightsPerSize[size],
		group: 'display',
	})
}

interface HDSBodyProps<T extends ElementType> extends BaseTextProps<T> {
	size?: '100' | '200' | '300'
}

const HDSBody = <T extends ElementType>({
	size = '200',
	weight = 'regular',
	...rest
}: HDSBodyProps<T> & Omit<ComponentPropsWithRef<T>, keyof HDSBodyProps<T>>) => {
	return createElement(TextImpl, {
		...rest,
		size,
		weight,
		group: 'hds-body',
	})
}

interface CodeProps<T extends ElementType> extends BaseTextProps<T> {
	size?: '100' | '200' | '300'
}

const Code = <T extends ElementType>({
	size = '200',
	weight = 'regular',
	...rest
}: CodeProps<T> & Omit<ComponentPropsWithRef<T>, keyof CodeProps<T>>) => {
	return createElement(TextImpl, {
		...rest,
		size,
		weight,
		group: 'code',
	})
}

const Text = {
	Body,
	DisplayExpressive,
	Label,
	Display,
	HDSBody,
	Code,
}

export { Text, TEXT_COLORS, TEXT_WEIGHTS }
