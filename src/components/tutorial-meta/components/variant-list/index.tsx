// @TODO uncomment when enabling cookies
// import Cookies from 'js-cookie'
import Link from 'components/link'
import classNames from 'classnames'
import {
	TutorialVariant,
	TutorialVariantOption,
	getVariantParam,
	getVariantPath,
} from 'views/tutorial-view/utils/variants'
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
							<li key={option.slug}>
								<Link
									className={classNames(
										s.link,
										isActiveOption ? s.activeLink : s.inActiveLink
									)}
									href={getVariantPath(asPath, variantParam)}
									aria-current={isActiveOption ? 'page' : undefined}
									onClick={() => {
										// @TODO add this in when we have real data to check against
										// const variantCookie = Cookies.get(variant.slug)
										// // if it exists and its not already set with the same value
										// if (!variantCookie || variantCookie !== variantParam) {
										// 	Cookies.set(variant.id, variantParam)
										// }
									}}
								>
									{option.name}
								</Link>
							</li>
						)
					})}
				</ul>
			</nav>
		</div>
	)
}
