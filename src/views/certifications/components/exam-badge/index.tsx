import Image, { ImageProps } from 'next/image'
import { CertificationProductSlug } from 'views/certifications/types'
import svgConsulBadge from './assets/consul-badge-mini.svg'
import svgTerraformBadge from './assets/terraform-badge-mini.svg'
import svgVaultBadge from './assets/vault-badge-mini.svg'
import s from './exam-badge.module.css'

/**
 * Map a product slug to a badge SVG.
 */
const BADGE_SVG_MAP: Record<CertificationProductSlug, ImageProps['src']> = {
	consul: svgConsulBadge,
	terraform: svgTerraformBadge,
	vault: svgVaultBadge,
}

/**
 * Renders an exam badge for a particular Certification product.
 */
function ExamBadge({ productSlug }: { productSlug: CertificationProductSlug }) {
	return (
		<Image
			alt=""
			className={s.root}
			src={BADGE_SVG_MAP[productSlug]}
			width={48}
			height={56}
		/>
	)
}

export { ExamBadge }
