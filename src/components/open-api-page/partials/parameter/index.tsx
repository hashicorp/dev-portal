import s from './style.module.css'
import { MdxInlineCode } from 'components/dev-dot-content/mdx-components'
import AccordionDisclosure from 'components/accordion-disclosure'
import Badge from 'components/badge'

function Parameter({ name, data, isFirstItem, isLastItem, arrayDepth = 0 }) {
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

	const title = (
		<>
			<MdxInlineCode className={s.name}>{name}</MdxInlineCode>{' '}
			<code className={`${s.typeString} g-type-code`}>{typeString}</code>{' '}
			{data.required && <Badge text="Required" color="highlight" />}
			{data.title && (
				<div
					className={s.descriptiveText}
					dangerouslySetInnerHTML={{ __html: data.title }}
				/>
			)}
		</>
	)

	const description = (
		<>
			{data.description && (
				<div
					className={s.descriptiveText}
					dangerouslySetInnerHTML={{ __html: data.description }}
				/>
			)}
		</>
	)
	// if non-object, don't render disclosure
	if (!hasProperties) {
		return (
			<div className={s.root}>
				{title}
				{description}
			</div>
		)
	}

	// has properties
	return (
		<div className={s.root}>
			<AccordionDisclosure title={title} description={description}>
				<div className={s.nestedProperties}>
					<hr />
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
			</AccordionDisclosure>
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
