export default {
  matchOnBasePath: true,
  ctaLinks: [
    [
      {
        text: 'GitHub',
        url: 'https://www.github.com/hashicorp/consul',
      },

      { text: 'Download', url: '/downloads' },
      {
        text: 'Try Cloud',
        url:
          'https://cloud.hashicorp.com/?utm_source=consul_io&utm_content=top_nav_consul',
      },
    ],
  ],
  menuItems: [
    { text: 'Overview', url: '/' },
    {
      text: 'Use Cases',
      submenu: [
        {
          text: 'Service Discovery and Health Checking',
          url: '/use-cases/service-discovery-and-health-checking',
        },
        {
          text: 'Network Infrastructure Automation',
          url: '/use-cases/network-infrastructure-automation',
        },
        {
          text: 'Multi-Platform Service Mesh',
          url: '/use-cases/multi-platform-service-mesh',
        },
      ],
    },
    {
      text: 'Enterprise',
      url:
        'https://www.hashicorp.com/products/consul/?utm_source=oss&utm_medium=header-nav&utm_campaign=consul',
      type: 'outbound',
    },
    'divider',
    {
      text: 'Tutorials',
      url: 'https://learn.hashicorp.com/consul',
      type: 'outbound',
    },
    {
      text: 'Docs',
      url: '/docs',
      type: 'inbound',
    },
    {
      text: 'API',
      url: '/api-docs',
      type: 'inbound',
    },
    {
      text: 'CLI',
      url: '/commands',
      type: 'inbound,',
    },
    {
      text: 'Community',
      url: '/community',
      type: 'inbound',
    },
  ],
}
