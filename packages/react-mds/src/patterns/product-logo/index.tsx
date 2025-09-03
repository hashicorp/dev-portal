import classNames from 'classnames'
import { makeNormalizer, makeNormalizerSet } from '../../utils/make-normalizer'
import capitalize from '@hashicorp/platform-util/text/capitalize'
import { FlightIcon } from '@hashicorp/react-mds/src/components/flight-icon'
import { Text } from '@hashicorp/react-mds/src/components/text'
import s from './product-logo.module.css'

const DEFAULT_SIZE = 'small'
const DEFAULT_COLOR = 'primary'
const DEFAULT_PRODUCT = 'hcp'

const HCP_PRODUCT_EXCEPTIONS = [
	'vault-radar',
	'vault-secrets',
	'vault-dedicated',
]

export const PRODUCT_LOGO_SIZES = ['small', 'medium', 'large'] as const
export const PRODUCT_LOGO_COLORS = ['primary', 'strong'] as const
export const PRODUCT_LOGO_PRODUCTS = [
	'hcp',
	'hashicorp',
	'boundary',
	'consul',
	'nomad',
	'packer',
	'terraform',
	'vault',
	'vault-dedicated',
	'vault-enterprise',
	'vault-radar',
	'vault-secrets',
	'vagrant',
	'waypoint',
] as const

export type ProductLogoSize = (typeof PRODUCT_LOGO_SIZES)[number]
export type ProductLogoColor = (typeof PRODUCT_LOGO_COLORS)[number]
export type ProductLogoProduct = (typeof PRODUCT_LOGO_PRODUCTS)[number]

export const normalizeProductLogoProps = makeNormalizerSet({
	size: makeNormalizer(PRODUCT_LOGO_SIZES, {
		fallback: DEFAULT_SIZE,
	}),
	color: makeNormalizer(PRODUCT_LOGO_COLORS, {
		fallback: DEFAULT_COLOR,
	}),
	product: makeNormalizer(PRODUCT_LOGO_PRODUCTS, {
		fallback: DEFAULT_PRODUCT,
	}),
})

export interface ProductLogoProps {
	size?: ProductLogoSize
	color?: ProductLogoColor
	product: ProductLogoProduct
}

export const ProductLogo = ({
	size = DEFAULT_SIZE,
	color = DEFAULT_COLOR,
	product,
}: ProductLogoProps) => {
	const productName = PRODUCT_LOGO_MAP[product]?.name ?? capitalize(product)

	return (
		<div className={classNames(s['product-logo'], s[size])}>
			<FlightIcon
				size={size === 'small' ? 16 : 24}
				name={PRODUCT_LOGO_MAP[product]?.icon ?? `${product}-color`}
				color={PRODUCT_LOGO_MAP[product]?.color}
			/>
			{HCP_PRODUCT_EXCEPTIONS.includes(product) ? (
				<div>
					{/* Always bold "HCP [Product]"... */}
					<Text.DisplayExpressive
						className={s[size]}
						color={color}
						weight="semibold"
					>
						{productName.split(' ').slice(0, 2).join(' ')}{' '}
					</Text.DisplayExpressive>
					{/* ...But display the sub-product in regular weight */}
					<Text.DisplayExpressive
						className={s[size]}
						color={color}
						weight="regular"
					>
						{productName.split(' ').slice(2)[0]}
					</Text.DisplayExpressive>
				</div>
			) : (
				// Default to unmodified display of the product name
				<Text.DisplayExpressive
					className={s[size]}
					color={color}
					weight="semibold"
				>
					{productName}
				</Text.DisplayExpressive>
			)}
		</div>
	)
}

const PRODUCT_LOGO_MAP: Record<
	string,
	{ icon: string; name: string; color: string }
> = {
	hcp: {
		icon: 'hashicorp-square',
		color: 'var(--token-color-hcp-brand)',
		name: 'HashiCorp Cloud Platform',
	},
	hashicorp: {
		icon: 'hashicorp',
		color: 'var(--token-color-hashicorp-brand)',
		name: 'HashiCorp',
	},
	'vault-radar': {
		icon: 'vault-square',
		color: 'var(--token-color-vault-radar-brand)',
		name: 'HCP Vault Radar',
	},
	'vault-secrets': {
		icon: 'vault-square',
		color: 'var(--token-color-vault-secrets-brand)',
		name: 'HCP Vault Secrets',
	},
	'vault-dedicated': {
		icon: 'vault-fill',
		color: 'var(--token-color-vault-secrets-brand)',
		name: 'HCP Vault Dedicated',
	},
	'vault-enterprise': {
		icon: 'vault-fill',
		color: 'var(--token-color-vault-secrets-brand)',
		name: 'Vault Enterprise',
	},
}
