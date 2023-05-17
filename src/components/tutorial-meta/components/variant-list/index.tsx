import Cookies from 'js-cookie'
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
			<label id={VARIANT_LIST_ID}>{variant.slug}</label>
			<nav>
				<ul aria-labelledby={VARIANT_LIST_ID}>
					{variant.options.map((option: TutorialVariantOption) => (
						<li
							key={option.slug}
							aria-current={activeVariantOption.slug === option.slug}
						>
							<ButtonLink
								color={
									activeVariantOption.slug === option.slug
										? 'primary'
										: 'secondary'
								}
								text={option.name}
								href={getVariantPath(
									asPath,
									getVariantParam(variant.slug, activeVariantOption.slug)
								)}
								onClick={() => {
									const variantCookie = Cookies.get(variant.id)
									// if it exists and its not already set with the same value
									if (!variantCookie || variantCookie !== option.id) {
										Cookies.set(variant.id, option.id)
									}
								}}
							/>
						</li>
					))}
				</ul>
			</nav>
		</div>
	)
}
