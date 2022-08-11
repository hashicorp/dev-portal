import s from './style.module.css'
import classNames from 'classnames'
import { IconAward16 } from '@hashicorp/flight-icons/svg-react/award-16'
import { IconCheckCircle16 } from '@hashicorp/flight-icons/svg-react/check-circle-16'

interface TierBadgeStyles extends React.CSSProperties {
	'--badge-color': string
}

export default function TierBadge({ tier, productSlug, size }) {
	const styles: TierBadgeStyles = {
		'--badge-color': `var(--token-color-${productSlug}-surface)`,
	}
	return (
		<span
			className={classNames(s.tierBadge, {
				[s.large]: size === 'large',
			})}
			style={styles}
		>
			{tier === 'official' && (
				<>
					<IconAward16 /> Official
				</>
			)}
			{tier === 'verified' && (
				<>
					<IconCheckCircle16 /> Verified
				</>
			)}
			{tier === 'community' && <>Community</>}
		</span>
	)
}
