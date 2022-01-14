module.exports = {
  // Leaving false for now. See linked resource when ready:
  // https://developers.google.com/search/docs/advanced/robots/create-robots-txt
  generateRobotsTxt: false,
  siteUrl: process.env.VERCEL_URL || 'http://localhost:3000/',
}
