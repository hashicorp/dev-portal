import s from './style.module.css'
import CardsGridList from 'components/cards-grid-list'
import CardLink from 'components/card-link'
import TierBadge from '../tier-badge'

export default function IntegrationsList({ integrations }) {
	return (
		<CardsGridList>
			{integrations.map((integration) => {
				return (
					<IntegrationCard
						key={integration.id}
						title={integration.name}
						description={integration.description}
						organization={integration.organization.slug}
						productSlug={integration.product.slug}
						tier={integration.tier}
						integrationSlug={integration.slug}
					/>
				)
			})}
		</CardsGridList>
	)
}

function IntegrationCard({
	title,
	description,
	organization,
	tier,
	integrationSlug,
	productSlug,
}) {
	return (
		<CardLink
			ariaLabel="TODO"
			className={s.integrationCard}
			href={`/${productSlug}/integrations/${integrationSlug}`}
		>
			<div className={s.header}>
				<h3 className={s.heading}>{title}</h3>
				<TierBadge tier={tier} productSlug={productSlug} size="small" />
			</div>

			<span className={s.organization}>{`@${organization}`}</span>
			<p className={s.body}>{description}</p>
		</CardLink>
	)
}
