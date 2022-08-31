import { useState } from 'react'
import classNames from 'classnames'
import InlineSvg from '@hashicorp/react-inline-svg'
import Collapsible from '../collapsible'
import svgChevronDown from '@hashicorp/flight-icons/svg/chevron-down-16.svg?include'
import s from './style.module.css'
import { MdxInlineCode } from 'components/dev-dot-content/mdx-components'

function Parameter({ name, data, isFirstItem, isLastItem, arrayDepth = 0 }) {
	const [isCollapsed, setIsCollapsed] = useState(true)
	if (data.type === 'array') {
		return (
			<Parameter
				name={name}
				data={data.items}
				arrayDepth={arrayDepth + 1}
				isFirstItem={isFirstItem}
				isLastItem={isLastItem}
			/>
		)
	}
	const hasProperties = data.type === 'object' && Boolean(data.properties)

	const typeArraySuffix =
		arrayDepth > 0 ? arrayFrom(arrayDepth, '[]').join('') : ''
	const typeString = `${data.type}${typeArraySuffix}`
	return (
		<div className={s.root}>
			<MdxInlineCode className={s.name}>{name}</MdxInlineCode>{' '}
			<code className={`${s.typeString} g-type-code`}>{typeString}</code>{' '}
			{data.required ? (
				<span className={`${s.requiredFlag} g-type-label-strong`}>
					Required
				</span>
			) : null}
			{data.title && (
				<div
					className={s.descriptiveText}
					dangerouslySetInnerHTML={{ __html: data.title }}
				/>
			)}
			{data.description ? (
				<div
					className={s.descriptiveText}
					dangerouslySetInnerHTML={{ __html: data.description }}
				/>
			) : null}
			{hasProperties && (
				<div className={s.nestedProperties}>
					<button
						className={`${s.toggleButton} g-type-body-small`}
						onClick={() => setIsCollapsed(!isCollapsed)}
					>
						<InlineSvg
							className={classNames(s.toggleIcon, {
								[s.isCollapsed]: isCollapsed,
							})}
							src={svgChevronDown}
						/>
						{isCollapsed ? 'Show properties' : 'Hide properties'}
					</button>
					<Collapsible isCollapsed={isCollapsed}>
						<div className={s.propertiesContainer}>
							{Object.keys(data.properties).map((propertyKey, idx) => {
								return (
									<Parameter
										key={propertyKey}
										name={propertyKey}
										data={data.properties[propertyKey]}
										isFirstItem={idx === 0}
										isLastItem={idx === Object.keys(data.properties).length - 1}
									/>
								)
							})}
						</div>
					</Collapsible>
				</div>
			)}
		</div>
	)
}

function arrayFrom(length, value = null) {
	const array = []
	for (let i = 0; i < length; i++) {
		array.push(value)
	}
	return array
}

export default Parameter
