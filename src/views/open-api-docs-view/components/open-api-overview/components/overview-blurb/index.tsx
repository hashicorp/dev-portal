import InlineLink from 'components/inline-link'
import { OpenApiOverviewProps } from '../../'
import s from './overview-blurb.module.css'

/**
 * TODO extract out of inline content, figure out where we want to keep this data
 * ideally somewhere with the open API data.
 *
 * Note from Zach:
 * 📌 For the future state where this content lives in the spec file itself,
 * one possibility might be the description property of the info section of the schema.
 * CommonMark is specifically mentioned as something that "MAY" be used for that field.
 * I think this content could be represented in markdown, and I think "should be representable in markdown"
 * might be a good guardrail for content in this area in the meantime 👍
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
