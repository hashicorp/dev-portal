// @TODO uncomment when enabling cookies
// import Cookies from 'js-cookie'
import classNames from 'classnames'
import {
	TutorialVariant,
	TutorialVariantOption,
	getVariantParam,
	getVariantPath,
} from 'views/tutorial-view/utils/variants'
import ButtonLink from 'components/button-link'
import { useRouter } from 'next/router'
import s from './variant-list.module.css'

export default function VariantList({ variant }: { variant: TutorialVariant }) {
	// @TODO hook this into a useVariants hook
	const activeVariantOption = variant.options[0]
	const VARIANT_LIST_ID = 'variant-list-label'
	const { asPath } = useRouter()

	return (
		<div className={s.root}>
			<label id={VARIANT_LIST_ID} className={s.label}>
				{variant.name}
			</label>
			<nav>
				<ul aria-labelledby={VARIANT_LIST_ID} className={s.list}>
					{variant.options.map((option: TutorialVariantOption) => {
						const variantParam = getVariantParam(variant.slug, option.slug)
						const isActiveOption = activeVariantOption.slug === option.slug
						return (
							<li
								key={option.slug}
								aria-current={activeVariantOption.slug === option.slug}
							>
								<ButtonLink
									className={classNames(!isActiveOption && s.linkBorderColor)}
									size="small"
									color={isActiveOption ? 'primary' : 'secondary'}
									text={option.name}
									href={getVariantPath(asPath, variantParam)}
									onClick={() => {
										// @TODO add this in when we have real data to check against
										// const variantCookie = Cookies.get(variant.slug)
										// // if it exists and its not already set with the same value
										// if (!variantCookie || variantCookie !== variantParam) {
										// 	Cookies.set(variant.id, variantParam)
										// }
									}}
								/>
							</li>
						)
					})}
				</ul>
			</nav>
		</div>
	)
}
