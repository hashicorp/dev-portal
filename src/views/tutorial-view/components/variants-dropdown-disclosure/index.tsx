import { useRouter } from 'next/router'
import DropdownDisclosure, {
	DropdownDisclosureLinkItem,
} from 'components/dropdown-disclosure'
import Text from 'components/text'
import s from './variants-dropdown-disclosure.module.css'

// @TODO add aria-labelledBy

// @TODO lift these to bonafide util to get this path once we have real data
function _tmpGetVariantPath(path: string, variantType: string) {
	const url = new URL(path, 'https://developer.hashicorp.com')

	// if the variant is not defined, or if it is defined in the path already, use that
	if (!variantType || url.searchParams.get('variants') === variantType) {
		return path
	}

	// otherwise just add the variant to the path
	url.searchParams.set('variants', variantType)

	return url.pathname.toString() + url.search.toString()
}

function getVariantParam(slug: string, optionSlug: string) {
	return `${slug}:${optionSlug}`
}

export function VariantsDropdownDisclosure({ variant }: { variant: $TSFixMe }) {
	// @TODO hook this into useVariants hook once data is wired
	const { asPath } = useRouter()
	const activeOption = variant.options[0]

	return (
		<div className={s.root}>
			<Text weight="semibold" size={100} className={s.label}>
				{variant.name}
			</Text>
			<DropdownDisclosure
				aria-label={variant.name}
				color="secondary"
				text={activeOption.name}
			>
				{variant.options.map((option) => (
					<DropdownDisclosureLinkItem
						key={option.slug}
						href={_tmpGetVariantPath(
							asPath,
							getVariantParam(variant.slug, option.slug)
						)}
					>
						{option.name}
					</DropdownDisclosureLinkItem>
				))}
			</DropdownDisclosure>
		</div>
	)
}
