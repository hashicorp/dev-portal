import { VariantDropdownDisclosure } from 'views/tutorial-view/components'
import { useVariant } from 'views/tutorial-view/utils/variants/context'
import { DesktopVariantList } from './desktop'
import s from './variant-list.module.css'

export function VariantList() {
	const { currentVariant } = useVariant()

	if (!currentVariant) {
		return null
	}

	return (
		<>
			<div className={s.desktopVariantList}>
				<DesktopVariantList variant={currentVariant} />
			</div>
			<div className={s.mobileVariantDropdownDisclosure}>
				<VariantDropdownDisclosure isFullWidth variant={currentVariant} />
			</div>
		</>
	)
}
