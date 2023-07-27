import InlineLink from 'components/inline-link'
import { OpenApiOverviewProps } from '../../types'
import s from './overview-blurb.module.css'

/**
 * TODO extract out of inline content, figure out where we want to keep this data
 * ideally somewhere with the open API data.
 * */

export default function OverviewBlurb({
	description,
}: Pick<OpenApiOverviewProps, 'description'>) {
	return (
		<div className={s.overviewAndResources}>
			<span>
				<h2 className={s.contentHeading}>Overview</h2>
				<p>{description}</p>
			</span>
			<span>
				<h2 className={s.contentHeading}>Additional Resources</h2>
				<p>
					Use the following resources to give you enough context to be
					successful.
				</p>
				<ul className={s.resourceList}>
					<li className={s.resourceLink}>
						<InlineLink
							color="secondary"
							href="/vault/tutorials/hcp-vault-secrets-get-started"
						>
							HCP Vault Secrets quick start
						</InlineLink>
					</li>
					<li className={s.resourceLink}>
						<InlineLink
							color="secondary"
							href="/hcp/docs/vault-secrets/constraints-and-known-issues"
						>
							Constraints and limitations
						</InlineLink>
					</li>
					<li className={s.resourceLink}>
						<InlineLink color="secondary" href="/hcp/docs/vault-secrets">
							What is HCP Vault Secrets?
						</InlineLink>
					</li>
				</ul>
			</span>
		</div>
	)
}
