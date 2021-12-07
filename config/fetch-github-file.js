const { Octokit } = require('@octokit/core')
const octokit = new Octokit({
  auth: process.env.GITHUB_PUBLIC_REPO_TOKEN,
})

async function fetchGithubFile({ owner, repo, path, ref }) {
  const response = await octokit.request(
    'GET /repos/{owner}/{repo}/contents/{path}',
    { owner, repo, path, ref }
  )
  if (response.status !== 200) {
    throw new Error(
      `Failed to fetch file from GitHub: ${JSON.stringify({
        owner,
        repo,
        path,
        ref,
      })}. Response status code: ${response.status}.`
    )
  }
  const data = response.data
  const fileString = Buffer.from(data.content, 'base64').toString('utf-8')
  return fileString
}

module.exports = fetchGithubFile
