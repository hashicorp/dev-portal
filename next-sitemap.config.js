/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: process.env.SITE_URL || 'https://developer.hashicorp.com',
	generateRobotsTxt: true, // (optional)
	robotsTxtOptions: {
		policies: [
			{
				userAgent: '*',
				allow: '/',
				disallow: '/_next/',
			},
		],
	},
	exclude: ['/swingset*', '/onboarding/*', '/profile*'],
	// ...other options
}
