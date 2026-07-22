/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import Image, { ImageProps } from 'next/image'
import { CertificationProductSlug } from 'views/certifications/types'
import svgTerraformBadge from "./assets/mini-terraform-badge.svg"
import svgVaultBadge from "./assets/mini-vault-badge.svg"
import s from './exam-badge.module.css'

/**
 * Map a product slug to a badge SVG.
 */
const BADGE_SVG_MAP: Record<CertificationProductSlug, ImageProps['src']> = {
	terraform: svgTerraformBadge,
	vault: svgVaultBadge,
}

/**
 * Renders an exam badge for a particular Certification product.
 */
function ExamBadge({
	productSlug,
}: {
	productSlug: CertificationProductSlug
}) {

	return (
		<Image
			alt=""
			className={s.root}
			src={BADGE_SVG_MAP[productSlug]}
			width={36}
			height={42}
		/>
	)
}

export { ExamBadge }
