import { TutorialVariant } from 'views/tutorial-view/utils/variants'
import { MobileVariantDropdownDisclosure } from 'views/tutorial-view/components'
import { DesktopVariantList } from './desktop'
import s from './variant-list.module.css'

export function VariantList({ variant }: { variant: TutorialVariant }) {
	return (
		<>
			<div className={s.desktopVariantList}>
				<DesktopVariantList variant={variant} />
			</div>
			<div className={s.mobileVariantDropdownDisclosure}>
				<MobileVariantDropdownDisclosure variant={variant} />
			</div>
		</>
	)
}
