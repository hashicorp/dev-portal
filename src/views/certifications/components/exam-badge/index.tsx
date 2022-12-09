import Image from 'next/image'
import svgConsulBadge from './assets/consul-badge-mini.svg'
import svgTerraformBadge from './assets/terraform-badge-mini.svg'
import svgVaultBadge from './assets/vault-badge-mini.svg'
import s from './exam-badge.module.css'

const BADGE_MAP = {
	consul: svgConsulBadge,
	terraform: svgTerraformBadge,
	vault: svgVaultBadge,
}

type ExamBadgeSlug = 'terraform' | 'consul' | 'vault'

interface ExamBadgeProps {
	productSlug: ExamBadgeSlug
}

function ExamBadge({ productSlug }: ExamBadgeProps) {
	return (
		<Image
			alt=""
			className={s.root}
			src={BADGE_MAP[productSlug]}
			width={48}
			height={56}
		/>
	)
}

export { ExamBadge }
export type { ExamBadgeSlug }
