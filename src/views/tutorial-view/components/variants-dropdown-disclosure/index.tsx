import DropdownDisclosure, {
	DropdownDisclosureLinkItem,
} from 'components/dropdown-disclosure'
import Text from 'components/text'
import s from './variants-dropdown-disclosure.module.css'

const STUB_VARIANTS_DATA = {
	slug: 'deployment',
	name: 'Deployment',
	options: [
		{
			slug: 'hcp',
			name: 'Hashicorp Cloud Platform (HCP)',
		},
		{ slug: 'self-managed', name: 'Self Managed' },
	],
}

function _tmpStubGetVariantPath(slug: string) {
	return `?variants=${STUB_VARIANTS_DATA.slug}:${slug}`
}

// @TODO add aria-labelledBy

export function VariantsDropdownDisclosure() {
	// @TODO hook this into useVariants hook once data is wired
	const activeOption = STUB_VARIANTS_DATA.options[0]
	return (
		<div className={s.root}>
			<Text weight="semibold" size={100} className={s.label}>
				{STUB_VARIANTS_DATA.name}
			</Text>
			<DropdownDisclosure
				aria-label={STUB_VARIANTS_DATA.name}
				color="secondary"
				text={activeOption.name}
			>
				{STUB_VARIANTS_DATA.options.map((option) => (
					<DropdownDisclosureLinkItem
						key={option.slug}
						href={_tmpStubGetVariantPath(option.slug)}
					>
						{option.name}
					</DropdownDisclosureLinkItem>
				))}
			</DropdownDisclosure>
		</div>
	)
}
