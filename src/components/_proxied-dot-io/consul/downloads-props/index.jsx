import Button from '@hashicorp/react-button'
import s from 'pages/_proxied-dot-io/consul/downloads/style.module.css'

export default function DownloadsProps(preMerchandisingSlot) {
	return {
		getStartedDescription:
			'Follow step-by-step tutorials on the essentials of Consul.',
		getStartedLinks: [
			{
				label: 'CLI Quickstart',
				href: 'https://developer.hashicorp.com/consul/tutorials/get-started-vms',
			},
			{
				label: 'HCP Consul',
				href: 'https://developer.hashicorp.com/consul/tutorials/get-started-hcp',
			},
			{
				label: 'HCS on Azure',
				href: 'https://developer.hashicorp.com/consul/tutorials/hcs-azure',
			},
			{
				label: 'Kubernetes Quickstart',
				href: 'https://developer.hashicorp.com/consul/tutorials/get-started-kubernetes',
			},
			{
				label: 'View all Consul tutorials',
				href: 'https://developer.hashicorp.com/consul/tutorials',
			},
		],
		tutorialLink: {
			href: 'https://developer.hashicorp.com/consul/tutorials',
			label: 'View Tutorials',
		},
		logo: (
			<img
				className={s.logo}
				alt="Consul"
				src={require('@hashicorp/mktg-logos/product/consul/primary/color.svg')}
			/>
		),
		merchandisingSlot: (
			<>
				{preMerchandisingSlot && preMerchandisingSlot}
				<div className={s.merchandisingSlot}>
					<div className={s.centerWrapper}>
						<p>
							Looking for a way to secure and automate application networking
							without the added complexity of managing the infrastructure?
						</p>
						<Button
							title="Try HCP Consul"
							linkType="inbound"
							url="https://portal.cloud.hashicorp.com/sign-up"
							theme={{
								variant: 'tertiary',
								brand: 'consul',
							}}
						/>
					</div>
				</div>

				<p>
					<a href="/docs/download-tools">&raquo; Download Consul Tools</a>
				</p>

				<div className={s.releaseCandidate}>
					<p>Note for ARM users:</p>

					<ul>
						<li>Use Armelv5 for all 32-bit armel systems</li>
						<li>Use Armhfv6 for all armhf systems with v6+ architecture</li>
						<li>Use Arm64 for all v8 64-bit architectures</li>
					</ul>

					<p>
						The following commands can help determine the right version for your
						system:
					</p>

					<code>$ uname -m</code>
					<br />
					<code>
						$ readelf -a /proc/self/exe | grep -q -c Tag_ABI_VFP_args && echo
						&quot;armhf&quot; || echo &quot;armel&quot;
					</code>
				</div>
			</>
		),
	}
}
