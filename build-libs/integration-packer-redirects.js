// The Slugs of the Integration Component Types
const TYPE_BUILDER = 'builder'
const TYPE_PROVISIONER = 'provisioner'
const TYPE_POST_PROCESSOR = 'post-processor'
const TYPE_DATA_SOURCE = 'data-source'

// Takes a Component Type slug and returns the old Plugin Library equivalent
function getOldPluginComponentSlug(componentType) {
	switch (componentType) {
		case TYPE_BUILDER:
			return 'builders'
		case TYPE_PROVISIONER:
			return 'provisioners'
		case TYPE_POST_PROCESSOR:
			return 'post-processors'
		case TYPE_DATA_SOURCE:
			return 'datasources'
		default:
			return ''
	}
}

/**
 * An array of legacy Packer plugins that were previously in the
 * Packer Plugin library that are now in the Integrations library.
 *
 * Redirects are generated from this array.
 */
const packerPluginIntegrations = [
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'oneandone',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'oneandone',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'alicloud',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'alicloud-ecs',
			},
			{
				type: TYPE_POST_PROCESSOR,
				newSlug: 'alicloud-import',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'anka',
		newSlug: 'veertu-anka',
		components: [
			{
				type: TYPE_POST_PROCESSOR,
				newSlug: 'anka-registry-push',
			},
			{
				type: TYPE_BUILDER,
				slug: 'vm-clone',
			},
			{
				type: TYPE_BUILDER,
				slug: 'vm-create',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'ansible',
		components: [
			{
				type: TYPE_PROVISIONER,
				slug: 'ansible',
			},
			{
				type: TYPE_PROVISIONER,
				slug: 'ansible-local',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'amazon',
		indexPages: [TYPE_DATA_SOURCE, TYPE_BUILDER],
		components: [
			{
				type: TYPE_DATA_SOURCE,
				slug: 'ami',
			},
			{
				type: TYPE_DATA_SOURCE,
				slug: 'parameterstore',
			},
			{
				type: TYPE_DATA_SOURCE,
				slug: 'secretsmanager',
			},
			{
				type: TYPE_BUILDER,
				slug: 'chroot',
			},
			{
				type: TYPE_BUILDER,
				slug: 'ebs',
			},
			{
				type: TYPE_BUILDER,
				slug: 'ebssurrogate',
			},
			{
				type: TYPE_BUILDER,
				slug: 'ebsvolume',
			},
			{
				type: TYPE_BUILDER,
				slug: 'instance',
			},
			{
				type: TYPE_POST_PROCESSOR,
				newSlug: 'import',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'azure',
		indexPages: [TYPE_BUILDER],
		components: [
			{
				type: TYPE_BUILDER,
				slug: 'arm',
			},
			{
				type: TYPE_BUILDER,
				slug: 'chroot',
			},
			{
				type: TYPE_BUILDER,
				slug: 'dtl',
			},
			{
				type: TYPE_PROVISIONER,
				newSlug: 'dtlartifact',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'chef',
		components: [
			{
				type: TYPE_PROVISIONER,
				slug: 'chef-client',
			},
			{
				type: TYPE_PROVISIONER,
				slug: 'chef-solo',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'cloudstack',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'cloudstack',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'converge',
		components: [
			{
				type: TYPE_PROVISIONER,
				newSlug: 'converge',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'digitalocean',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'digitalocean',
			},
			{
				type: TYPE_DATA_SOURCE,
				newSlug: 'digitalocen-image', // TODO: a Typo is here
			},
			{
				type: TYPE_POST_PROCESSOR,
				newSlug: 'digitalocean-import',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'docker',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'docker',
			},
			{
				type: TYPE_POST_PROCESSOR,
				slug: 'docker-import',
			},
			{
				type: TYPE_POST_PROCESSOR,
				slug: 'docker-push',
			},
			{
				type: TYPE_POST_PROCESSOR,
				slug: 'docker-save',
			},
			{
				type: TYPE_POST_PROCESSOR,
				slug: 'docker-tag',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'external',
		indexPages: [TYPE_DATA_SOURCE],
		components: [
			{
				type: TYPE_DATA_SOURCE,
				slug: 'external',
			},
			{
				type: TYPE_DATA_SOURCE,
				slug: 'raw',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'git',
		indexPages: [TYPE_DATA_SOURCE],
		components: [
			{
				type: TYPE_DATA_SOURCE,
				slug: 'commit',
			},
			{
				type: TYPE_DATA_SOURCE,
				slug: 'repository',
			},
			{
				type: TYPE_DATA_SOURCE,
				slug: 'tree',
			},
		],
	},

	// TODO: Google Cloud Platform
	// TODO: Gridscale
	// TODO: HashiCups
	// TODO: Hetzner Cloud
	// TODO: HyperOne
	// TODO: Hyper-V
	// TODO: InSpec
	// TODO: JD Cloud
	// TODO: Kamatera
	// TODO: Linode
	// TODO: Libvirt
	// TODO: LXC
	// TODO: LXD
	// TODO: Mondoo
	// TODO: Naver Cloud
	// TODO: Nutanix
	// TODO: OpenStack
	// TODO: Oracle
	// TODO: Outscale
	// TODO: Parallels
	// TODO: ProfitBrix
	// TODO: Proxmox
	// TODO: Puppet
	// TODO: QEMU
	// TODO: Salt
	// TODO: Scaleway
	// TODO: SSH Key
	// TODO: Tart
	// TODO: Tencent Cloud
	// TODO: Triton
	// TODO: UCloud
	// TODO: UpCloud
	// TODO: Vagrant
	// TODO: VirtualBox
	// TODO: Volcengine
	// TODO: VMWare vSphere
	// TODO: VMware
	// TODO: Vultr
	// TODO: Yandex
]

module.exports.generatePackerPluginRedirects = () => {
	let redirects = []
	packerPluginIntegrations.forEach((integration) => {
		if (integration.enabled === false) {
			// exit early if integration is not enabled
			return
		}

		// TODO: Remove Testing Prefix
		const testingPrefix =
			'https://dev-portal-git-brpacker-plugins-hashicorp.vercel.app'

		// For each component create a redirect
		integration.components.forEach((component) => {
			var redirectSource = `/packer/plugins/${getOldPluginComponentSlug(
				component.type
			)}/${integration.slug}${component.slug ? `/${component.slug}` : ''}`

			var redirectDestination = `/packer/integrations/${integration.org}/${
				integration.newSlug ? integration.newSlug : integration.slug
			}/latest/components/${component.type}/${
				component.newSlug ? component.newSlug : component.slug
			}`

			redirects.push({
				source: testingPrefix + redirectSource,
				destination: testingPrefix + redirectDestination,
				permanent: true,
			})
		})

		// For each index page create a redirect
		integration.indexPages?.forEach((componentType) => {
			var redirectSource = `/packer/plugins/${getOldPluginComponentSlug(
				componentType
			)}/${integration.slug}`
			var redirectDestination = `/packer/integrations/${integration.org}/${
				integration.newSlug ? integration.newSlug : integration.slug
			}`

			redirects.push({
				source: testingPrefix + redirectSource,
				destination: testingPrefix + redirectDestination,
				permanent: true,
			})
		})
	})
	// TODO: remove log
	console.log(redirects)
}
