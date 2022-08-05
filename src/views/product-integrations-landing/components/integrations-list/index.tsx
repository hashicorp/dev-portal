import CardsGridList from 'components/cards-grid-list'
import CardLink from 'components/card-link'
import {
	CardEyebrow,
	CardHeading,
	CardBody,
} from 'components/tutorial-collection-cards'

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
						repoUrl={integration.repo_url}
					/>
				)
			})}
		</CardsGridList>
	)
}

function IntegrationCard({ title, description, organization, repoUrl }) {
	return (
		<CardLink href={repoUrl} openInNewTab={true}>
			<CardHeading level={3} text={title} />
			<CardEyebrow text={`@${organization}`} />
			<CardBody text={description} />
		</CardLink>
	)
}
