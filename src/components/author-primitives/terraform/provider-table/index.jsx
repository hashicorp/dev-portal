import { MdxTable } from 'components/dev-dot-content/mdx-components'
import ProviderBadge from './components/provider-badge'
import s from './style.module.css'

export default function ProviderTable() {
	return (
		<MdxTable className={s.providerTable}>
			<thead>
				<tr>
					<th align="left">Tier</th>
					<th align="left">Description</th>
					<th align="left">Namespace</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>
						<ProviderBadge type="official" />
					</td>
					<td>
						<span>
							Official providers are owned and maintained by HashiCorp{' '}
						</span>
					</td>
					<td>
						<code>
							<span>hashicorp</span>
						</code>
					</td>
				</tr>
				<tr>
					<td>
						<ProviderBadge type="partner" />
					</td>
					<td>
						<span>
							Partner providers are written, maintained, validated and published
							by third-party companies against their own APIs. To earn a partner
							provider badge the partner must participate in the{' '}
						</span>
						<a href="https://www.hashicorp.com/ecosystem/become-a-partner/">
							<i>
								<span>HashiCorp Technology Partner Program</span>
							</i>
						</a>
						<i>
							<span>.</span>
						</i>
					</td>
					<td>
						<span>Third-party organization, e.g. </span>
						<code>
							<span>mongodb/mongodbatlas</span>
						</code>
					</td>
				</tr>
				<tr>
					<td>
						<ProviderBadge type="community" />
					</td>
					<td>
						Community providers are published to the Terraform Registry by
						individual maintainers, groups of maintainers, or other members of
						the Terraform community.
					</td>
					<td>
						Maintainer&rsquo;s individual or organization account, e.g.{' '}
						<code>DeviaVir/gsuite</code>
					</td>
				</tr>
				<tr>
					<td>
						<ProviderBadge type="archived" />
					</td>
					<td>
						Archived Providers are Official or Partner Providers that are no
						longer maintained by HashiCorp or the community. This may occur if
						an API is deprecated or interest was low.
					</td>
					<td>
						<code>hashicorp</code> or third-party
					</td>
				</tr>
			</tbody>
		</MdxTable>
	)
}
