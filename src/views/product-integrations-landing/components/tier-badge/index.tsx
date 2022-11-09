import s from './style.module.css'
import classNames from 'classnames'
import { IconAward16 } from '@hashicorp/flight-icons/svg-react/award-16'
import { IconHandshake16 } from '@hashicorp/flight-icons/svg-react/handshake-16'
import { Tier } from 'lib/integrations-api-client'

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
			{tier === Tier.OFFICIAL && (
				<>
					<IconAward16 /> Official
				</>
			)}
			{tier === Tier.PARTNER && (
				<>
					<IconHandshake16 /> Partner
				</>
			)}
			{tier === Tier.COMMUNITY && <>Community</>}
		</span>
	)
}
