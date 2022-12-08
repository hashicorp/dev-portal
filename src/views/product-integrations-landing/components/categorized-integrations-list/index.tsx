import { Integration } from 'lib/integrations-api-client'
import IntegrationsList from '../integrations-list'
import s from './style.module.css'

export default function CategorizedIntegrationsList({ integrations }) {
	const official = integrations.filter(
		(i) => i.tier === Integration.tier.OFFICIAL
	)
	const partner = integrations.filter(
		(i) => i.tier === Integration.tier.PARTNER
	)
	const community = integrations.filter(
		(i) => i.tier === Integration.tier.COMMUNITY
	)

	return (
		<div className={s.categorizedIntegrationList}>
			{official.length > 0 && (
				<IntegrationCategory category="Official" integrations={official} />
			)}

			{partner.length > 0 && (
				<IntegrationCategory category="Partner" integrations={partner} />
			)}

			{community.length > 0 && (
				<IntegrationCategory category="Community" integrations={community} />
			)}
		</div>
	)
}

function IntegrationCategory({ category, integrations }) {
	return (
		<div className={s.integrationCategory}>
			<h3>{category} Integrations</h3>
			<IntegrationsList integrations={integrations} />
		</div>
	)
}
