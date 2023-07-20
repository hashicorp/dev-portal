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
	// TODO: Google Cloud Platform ❌ (TODO, DNE in Integrations Library)
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'gridscale',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'gridscale',
			},
		],
	},
	{
		enabled: false, // ❌ TODO: Not Sync'd
		org: 'BrandonRomano',
		slug: 'hashicups',
		indexPages: [
			TYPE_POST_PROCESSOR,
			TYPE_PROVISIONER,
			TYPE_DATA_SOURCE,
			TYPE_BUILDER,
		],
		components: [
			{
				type: TYPE_POST_PROCESSOR,
				slug: 'receipt',
			},
			{
				type: TYPE_PROVISIONER,
				slug: 'toppings',
			},
			{
				type: TYPE_DATA_SOURCE,
				slug: 'coffees',
			},
			{
				type: TYPE_DATA_SOURCE,
				slug: 'ingredients',
			},
			{
				type: TYPE_BUILDER,
				slug: 'order',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'hetzner-cloud',
		newSlug: 'hcloud',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'hetzner-cloud',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'hyperone',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'hyperone',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'hyperv',
		indexPages: [TYPE_BUILDER],
		components: [
			{
				type: TYPE_BUILDER,
				slug: 'iso',
			},
			{
				type: TYPE_BUILDER,
				slug: 'vmcx',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'inspec',
		components: [
			{
				type: TYPE_PROVISIONER,
				newSlug: 'inspec',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'jdcloud',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'jdcloud',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'kamatera',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'kamatera',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'linode',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'linode',
			},
		],
	},
	// TODO: Libvirt ❌ (TODO, DNE in Integrations Library)
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'lxc',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'lxc',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'lxd',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'lxd',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'mondoo',
		newSlug: 'cnspec',
		components: [
			{
				type: TYPE_PROVISIONER,
				slug: 'cnspec',
			},
			{
				type: TYPE_PROVISIONER,
				slug: 'mondoo',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'ncloud',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'ncloud',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'nutanix',
		indexPages: [TYPE_BUILDER],
		components: [
			{
				type: TYPE_BUILDER,
				slug: 'nutanix',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'openstack',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'openstack',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'oracle',
		indexPages: [TYPE_BUILDER],
		components: [
			{
				type: TYPE_BUILDER,
				slug: 'classic',
			},
			{
				type: TYPE_BUILDER,
				slug: 'oci',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'outscale',
		indexPages: [TYPE_BUILDER],
		components: [
			{
				type: TYPE_BUILDER,
				slug: 'outscale-bsu',
			},
			{
				type: TYPE_BUILDER,
				slug: 'outscale-bsusurrogate',
			},
			{
				type: TYPE_BUILDER,
				slug: 'outscale-bsuvolume',
			},
			{
				type: TYPE_BUILDER,
				slug: 'outscale-chroot',
			},
			{
				type: TYPE_DATA_SOURCE,
				newSlug: 'omi',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'parallels',
		indexPages: [TYPE_BUILDER],
		components: [
			{
				type: TYPE_BUILDER,
				slug: 'iso',
			},
			{
				type: TYPE_BUILDER,
				slug: 'pvm',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'profitbricks',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'profitbricks',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'proxmox',
		indexPages: [TYPE_BUILDER],
		components: [
			{
				type: TYPE_BUILDER,
				slug: 'clone',
			},
			{
				type: TYPE_BUILDER,
				slug: 'iso',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'puppet',
		components: [
			{
				type: TYPE_PROVISIONER,
				slug: 'puppet-masterless',
			},
			{
				type: TYPE_PROVISIONER,
				slug: 'puppet-server',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'qemu',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'qemu',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'salt',
		components: [
			{
				type: TYPE_PROVISIONER,
				newSlug: 'salt-masterless',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'scaleway',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'scaleway',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'sshkey',
		components: [
			{
				type: TYPE_DATA_SOURCE,
				newSlug: 'sshkey',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'tart',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'tart',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'tencentcloud',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'cvm',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'triton',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'triton',
			},
		],
	},
	{
		enabled: false, // ✅ Tested
		org: 'BrandonRomano',
		slug: 'ucloud',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'uhost',
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
		slug: 'upcloud',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'upcloud',
			},
			{
				type: TYPE_POST_PROCESSOR,
				newSlug: 'upcloud-import',
			},
		],
	},
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
