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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
	{
		enabled: true,
		org: 'BrandonRomano',
		slug: 'googlecompute',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'googlecompute',
			},
			{
				type: TYPE_POST_PROCESSOR,
				slug: 'googlecompute-export',
			},
			{
				type: TYPE_POST_PROCESSOR,
				slug: 'googlecompute-import',
			},
		],
	},
	{
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
		org: 'BrandonRomano',
		slug: 'linode',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'linode',
			},
		],
	},
	{
		enabled: true,
		org: 'BrandonRomano',
		slug: 'libvirt',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'libvirt',
			},
		],
	},
	{
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
		enabled: true,
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
	{
		enabled: true,
		org: 'BrandonRomano',
		slug: 'vagrant',
		components: [
			{
				type: TYPE_POST_PROCESSOR,
				slug: 'vagrant',
			},
			{
				type: TYPE_POST_PROCESSOR,
				slug: 'vagrant-cloud',
			},
			{
				type: TYPE_BUILDER,
				newSlug: 'vagrant',
			},
		],
	},
	{
		enabled: true,
		org: 'BrandonRomano',
		slug: 'virtualbox',
		indexPages: [TYPE_BUILDER],
		components: [
			{
				type: TYPE_BUILDER,
				slug: 'iso',
			},
			{
				type: TYPE_BUILDER,
				slug: 'ovf',
			},
			{
				type: TYPE_BUILDER,
				slug: 'vm',
			},
		],
	},
	{
		enabled: true,
		org: 'BrandonRomano',
		slug: 'volcengine',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'volcengine-ecs',
			},
		],
	},
	{
		enabled: true,
		org: 'BrandonRomano',
		slug: 'vsphere',
		indexPages: [TYPE_BUILDER],
		components: [
			{
				type: TYPE_BUILDER,
				slug: 'vsphere-clone',
			},
			{
				type: TYPE_BUILDER,
				slug: 'vsphere-iso',
			},
			{
				type: TYPE_BUILDER,
				slug: 'vsphere-supervisor',
			},
			{
				type: TYPE_POST_PROCESSOR,
				slug: 'vsphere',
			},
			{
				type: TYPE_POST_PROCESSOR,
				slug: 'vsphere-template',
			},
		],
	},
	{
		enabled: true,
		org: 'BrandonRomano',
		slug: 'vmware',
		indexPages: [TYPE_BUILDER],
		components: [
			{
				type: TYPE_BUILDER,
				slug: 'iso',
			},
			{
				type: TYPE_BUILDER,
				slug: 'vmx',
			},
		],
	},
	{
		enabled: true,
		org: 'BrandonRomano',
		slug: 'vultr',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'vultr',
			},
		],
	},
	{
		enabled: true,
		org: 'BrandonRomano',
		slug: 'yandex',
		components: [
			{
				type: TYPE_BUILDER,
				newSlug: 'yandex',
			},
			{
				type: TYPE_POST_PROCESSOR,
				slug: 'yandex-import',
			},
			{
				type: TYPE_POST_PROCESSOR,
				slug: 'yandex-export',
			},
		],
	},
]

// There are a few Packer plugins that have been archived,
// and the transition to our integrations library feels like
// the right time to no longer present them on our website.
//
// Specifically, we would have to unarchive these repos on
// GitHub, and then make the Integrations Library adjustments,
// and then re-archive. The Packer team felt this was not needed.
//
// We will redirect to the respective GitHub repositories
// so anyone looking for this information can still find the
// information.
const archivedPluginRedirects = [
	// Chef
	{
		source: '/packer/plugins/provisioners/chef/chef-client',
		destination:
			'https://github.com/hashicorp/packer-plugin-chef/blob/main/docs/provisioners/chef-client.mdx',
		permanent: true,
	},
	{
		source: '/packer/plugins/provisioners/chef/chef-solo',
		destination:
			'https://github.com/hashicorp/packer-plugin-chef/blob/main/docs/provisioners/chef-solo.mdx',
		permanent: true,
	},
	// Converge
	{
		source: '/packer/plugins/provisioners/converge',
		destination:
			'https://github.com/hashicorp/packer-plugin-converge/blob/main/docs/provisioners/converge.mdx',
		permanent: true,
	},
	// InSpec
	{
		source: '/packer/plugins/provisioners/inspec',
		destination:
			'https://github.com/hashicorp/packer-plugin-inspec/blob/main/docs/provisioners/inspec.mdx',
		permanent: true,
	},
	// Puppet
	{
		source: '/plugins/provisioners/puppet/puppet-masterless',
		destination:
			'https://github.com/hashicorp/packer-plugin-puppet/blob/main/docs/provisioners/puppet-masterless.mdx',
		permanent: true,
	},
	{
		source: '/packer/plugins/provisioners/puppet/puppet-server',
		destination:
			'https://github.com/hashicorp/packer-plugin-puppet/blob/main/docs/provisioners/puppet-server.mdx',
		permanent: true,
	},
	// Salt
	{
		source: '/packer/plugins/provisioners/salt',
		destination:
			'https://github.com/hashicorp/packer-plugin-salt/blob/main/docs/provisioners/salt-masterless.mdx',
		permanent: true,
	},
]

const generatePackerPluginRedirects = () => {
	let redirects = []
	packerPluginIntegrations.forEach((integration) => {
		if (integration.enabled === false) {
			// exit early if integration is not enabled
			return
		}

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
				source: redirectSource,
				destination: redirectDestination,
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
				source: redirectSource,
				destination: redirectDestination,
				permanent: true,
			})
		})
	})

	// Redirect the Plugin landing page to the new Integrations landing page
	redirects.push({
		source: '/packer/plugins',
		destination: '/packer/integrations',
		permanent: true,
	})

	// All of the generated redirects + the Archived redirects
	return redirects.concat(archivedPluginRedirects)
}

module.exports.packerPluginRedirects = generatePackerPluginRedirects()
