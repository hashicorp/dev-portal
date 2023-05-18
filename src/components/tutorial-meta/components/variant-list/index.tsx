import { TutorialVariant } from 'views/tutorial-view/utils/variants'
import { VariantDropdownDisclosure } from 'views/tutorial-view/components'
import { DesktopVariantList } from './desktop'
import s from './variant-list.module.css'

export function VariantList({ variant }: { variant: TutorialVariant }) {
	return (
		<>
			<div className={s.desktopVariantList}>
				<DesktopVariantList variant={variant} />
			</div>
			<div className={s.mobileVariantDropdownDisclosure}>
				<VariantDropdownDisclosure isFullWidth variant={variant} />
			</div>
		</>
	)
}
