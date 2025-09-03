import { Badge } from '../../badge'
import { localize } from '../../../utils/i18n'
import { useLocale } from '@web/utils/i18n/helpers'
import s from './form-indicator.module.css'

interface IndicatorProps {
	isOptional?: boolean
	isRequired?: boolean
}

const Indicator = ({ isOptional, isRequired }: IndicatorProps) => {
	const locale = useLocale()

	const className = isOptional ? s.optional : null

	if (isOptional) {
		return (
			<span aria-hidden="true" className={className}>
				{`(${localize('optional', locale, 'title')})`}
			</span>
		)
	} else if (isRequired) {
		return (
			<Badge
				aria-hidden="true"
				className={className}
				size="small"
				text={localize('required', locale, 'title')}
			/>
		)
	}

	return null
}

export { Indicator }
