import Image from 'next/image'
import svgConsulBadge from './assets/consul-badge-mini.svg'
import svgTerraformBadge from './assets/terraform-badge-mini.svg'
import svgVaultBadge from './assets/vault-badge-mini.svg'
import s from './exam-badge-and-title.module.css'

const BADGE_MAP = {
	consul: svgConsulBadge,
	terraform: svgTerraformBadge,
	vault: svgVaultBadge,
}

function ExamBadgeAndTitle({
	title,
	eyebrow,
	productSlug,
}: {
	title: string
	eyebrow: string
	productSlug: 'consul' | 'terraform' | 'vault'
}) {
	return (
		<div className={s.root}>
			<Image
				alt=""
				className={s.badge}
				src={BADGE_MAP[productSlug]}
				width={48}
				height={56}
			/>
			<div className={s.text}>
				<div className={s.eyebrow}>{eyebrow}</div>
				<div className={s.title}>{title}</div>
			</div>
		</div>
	)
}

export { ExamBadgeAndTitle }
