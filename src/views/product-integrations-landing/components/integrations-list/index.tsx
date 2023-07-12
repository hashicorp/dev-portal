/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import BadgeList from 'components/badge-list'
import Button from 'components/button'
import CardLink from 'components/card-link'
import CardsGridList from 'components/cards-grid-list'
import { getIntegrationBadges } from 'lib/get-integration-badges'
import { getIntegrationUrl } from 'lib/integrations'
import { Integration } from 'lib/integrations-api-client/integration'
import s from './style.module.css'

interface IntegrationsListProps {
	integrations: Array<Integration>
	onClearFiltersClicked: () => void
}

export default function IntegrationsList({
	integrations,
	onClearFiltersClicked,
}: IntegrationsListProps) {
	return integrations.length ? (
		<CardsGridList fixedColumns={1}>
			{integrations.map((integration: Integration) => {
				return (
					<IntegrationCard key={integration.id} integration={integration} />
				)
			})}
		</CardsGridList>
	) : (
		<NoResultsMessage onClearFiltersClicked={onClearFiltersClicked} />
	)
}

interface IntegrationCardProps {
	integration: Integration
}

/**
 * TODO: refactor the 'view details' cta to use
 * StandaloneLinkContents when lifted to a global component
 * https://app.asana.com/0/1202097197789424/1204167616054151
 */

function IntegrationCard({ integration }: IntegrationCardProps) {
	const url = getIntegrationUrl(integration)
	const isExternalLink = !url.startsWith('/')

	return (
		<CardLink
			ariaLabel={integration.name}
			className={s.integrationCard}
			href={url}
			opensInNewTab={isExternalLink}
		>
			<div className={s.cardContent}>
				<div className={s.left}>
					<div>
						<div className={s.nameVersionWrapper}>
							<h3 className={s.heading}>{integration.name}</h3>
							{!integration.hide_versions && (
								<span className={s.version}>v{integration.versions[0]}</span>
							)}
						</div>
						<span
							className={s.organization}
						>{`@${integration.organization.slug}`}</span>
					</div>
					<p className={s.body}>{integration.description}</p>
				</div>
				<div className={s.right}>
					<BadgeList
						className={s.badgeList}
						badges={getIntegrationBadges(integration, false)}
						size="medium"
					/>
					<span className={s.viewDetails}>
						View Details
						{isExternalLink ? <IconExternalLink16 /> : <IconArrowRight16 />}
					</span>
				</div>
			</div>
		</CardLink>
	)
}

interface NoResultsMessageProps {
	onClearFiltersClicked: () => void
	description?: string
}

export function NoResultsMessage({
	onClearFiltersClicked,
	description,
}: NoResultsMessageProps) {
	return (
		<div className={s.noResultsWrapper}>
			<p className={s.noResultsTitle}>No Results</p>
			<p className={s.noResultsDescription}>
				{description ||
					'Try adjusting your selected filters or using different keywords.'}
			</p>
			<div className={s.noResultsButtonWrapper}>
				<Button
					onClick={(e) => {
						e.preventDefault()
						onClearFiltersClicked()
					}}
					color="secondary"
					text="Clear Filters"
					size="small"
					icon={<IconX16 />}
				/>
			</div>
		</div>
	)
}
