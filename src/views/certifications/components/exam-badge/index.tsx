/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Image, { ImageProps } from 'next/image'
import { CertificationProductSlug, ExamTier } from 'views/certifications/types'
import svgConsulBadgeAssociate from './assets/consul-badge-mini-associate.svg'
import svgConsulBadgePro from './assets/consul-badge-mini-pro.svg'
import svgTerraformBadgeAssociate from './assets/terraform-badge-mini-associate.svg'
import svgTerraformBadgePro from './assets/terraform-badge-mini-pro.svg'
import svgVaultBadgeAssociate from './assets/vault-badge-mini-associate.svg'
import svgVaultBadgePro from './assets/vault-badge-mini-pro.svg'
import s from './exam-badge.module.css'

/**
 * Map a product slug to a badge SVG.
 */
const BADGE_SVG_MAP: Record<
	CertificationProductSlug,
	Record<ExamTier, ImageProps['src']>
> = {
	consul: {
		associate: svgConsulBadgeAssociate,
		pro: svgConsulBadgePro,
	},
	terraform: {
		associate: svgTerraformBadgeAssociate,
		pro: svgTerraformBadgePro,
	},
	vault: {
		associate: svgVaultBadgeAssociate,
		pro: svgVaultBadgePro,
	},
}

/**
 * Renders an exam badge for a particular Certification product.
 */
function ExamBadge({
	productSlug,
	examTier = 'associate',
}: {
	productSlug: CertificationProductSlug
	examTier?: ExamTier
}) {
	return (
		<Image
			alt=""
			className={s.root}
			src={BADGE_SVG_MAP[productSlug][examTier]}
			width={48}
			height={56}
		/>
	)
}

export { ExamBadge }
