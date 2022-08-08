import IntegrationsList from '../integrations-list'
import s from './style.module.css'

export default function CategorizedIntegrationsList({ integrations }) {
	const official = integrations.filter((i) => i.tier === 'official')
	const verified = integrations.filter((i) => i.tier === 'verified')
	const community = integrations.filter((i) => i.tier === 'community')

	return (
		<div className={s.categorizedIntegrationList}>
			{official.length > 0 && (
				<IntegrationCategory category="Official" integrations={official} />
			)}

			{verified.length > 0 && (
				<IntegrationCategory category="Verified" integrations={verified} />
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
