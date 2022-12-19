# Developing HashiCorp Developer

> 🚨 **Please note**: This is an internal README, intended for developers working on the project. Please visit [the project README](../README.md) for a more generic overview of HashiCorp Developer.

## Overview

Documentation for each product is sourced from its respective product repository, and served via Digital's [content API](https://github.com/hashicorp/mktg-content-workflows/#get-apicontentproductfullpath)

For background information on this project, refer to [[MKTG-034]](https://docs.google.com/document/d/1ASyBOCWWP8VUahbL5c5y0qrDMgqhYdXJ2h15xzh3JtA/edit#heading=h.spiwwyows3cr).

To track the progress of this project, refer to the [Dev Portal Asana Portfolio](https://app.asana.com/0/portfolio/1200682159451359/list) and join [#proj-dev-portal](https://hashicorp.slack.com/archives/C01KCU4HDPY) on slack.

## Local Development

### Installing Recommended VS Code Extensions

In the `.vscode` directory, you'll find [an `extensions.json` file](./.vscode/extensions.json) that lists recommended VS Code extensions to use for this project.

To add the recommended extensions:

1. Open VS Code
2. Open [the command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette)
3. Type `Show Recommended Extensions`
4. Hit the `Enter` key
5. Click the "Install Workspace Recommended Extensions" icon (it looks like a cloud with an arrow pointing down) under the Workspace Recommendations section of the sidebar

### Project VS Code Settings

In the `.vscode` directory, you'll find [a `settings.json` file](./.vscode/settings.json) with VS Code settings for this project.

- `source.fixAll.eslint` enables auto-fixing of eslint issues when a file is saved
- `eslint.codeActionsOnSave.rules` specifies which rules can be auto-fixed on save

### Setting Up Environment Variables

There are a few things you need to set up before you can begin developing in this repository.

1. [Install the Vercel CLI](https://vercel.com/cli)

   The CLI is needed for the next 2 steps.

2. Run `vercel link`

   This command will prompt you to connect your local copy of repo to [the Vercel `dev-portal` project](https://vercel.com/hashicorp/dev-portal). The command creates a `.vercel` directory with a JSON file that contains the information that links to the Vercel project.

3. Run `vercel env pull .env.local`

   This command will pull the development environment variables from the linked Vercel project and write them to a new file called `.env.local`.

Additionally, you can add a GitHub [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to prevent running into GitHub's API rate limit for unauthenticated requests by adding `GITHUB_TOKEN` to your `.env.local`.

### Running The Project

If you're developing in this repository, get started by running:

```
npm install
npm start
```

This will give you a development server running on [localhost:3000](http://localhost:3000).

To preview the co-located `.io` project sites, you can run variations on the `npm start` command:

```sh
npm run start:boundary # https://www.boundaryproject.io
npm run start:nomad # https://www.nomadproject.io
npm run start:sentinel # https://docs.hashicorp.com/sentinel
npm run start:vault # https://www.vaultproject.io
npm run start:waypoint # https://www.boundaryproject.io
```

These commands set the `DEV_IO` env variable in order to simulate the environment we use to deploy the `.io` sites. Further details on the local preview processes for the `.io` sites can be found in [MKTG-040 RFC](https://docs.google.com/document/d/1iLx2jL09YkLbhSXdK9ScSedwSiujYDEa524FejOAnZM/edit) and in the [corresponding Digital RFC](https://docs.google.com/document/d/1tvEhrLF0YyRimgR-Ibd_lo7sqTvw0TFAi77jbgjROVk/edit).

## Accessibility

- [@axe-core/react](./axe-core-react.md)

## Testing

We use [jest](https://jestjs.io/) to write unit tests for our code. We also have [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) integrated for writing tests against our rendered React components.

To run tests:

```
npm test
```

To run tests in watch mode:

```
npm run test:watch
```

Additionally, we use [Playwright](https://playwright.dev/) for end-to-end integration tests. Playwright tests should be used when testing functionality that requires a running Next.js server, such as middleware and redirects.

To run the end-to-end tests:

```
npm run test:e2e
```

To view the report for an end-to-end test run:

```
npx playwright show-report
```

## Component Organization

In order to create some structure and consistency throughout this project, we're creating some light guidelines around where certain components should live. We have three top-level folders which should house components:

```
src/
  components/
  views/
  layouts/
  hooks/
  contexts/
```

- **`components`** - Shareable, smaller components for use across any number of other components
- **`views`** - Componentry which represents a full site "view." This is a way to abstract out page components and easily co-locate related code. Not necessarily intended for re-use, unless one needs to render the same view on multiple pages. This also allows us to co-locate sub-components and test files with page components, which is otherwise difficult with file-based routing
- **`layouts`** - Layout components which are generic and possibly used across different pages (see [Next.js docs](https://nextjs.org/docs/basic-features/layouts#per-page-layouts))
- **`hooks`** - Shared hooks which are applicable for use across a variety of other components. Hooks which access shared contexts should live in `contexts/` (see below)
- **`contexts`** - Shared [contexts](https://reactjs.org/docs/context.html) and utilities for accessing / interacting with the context values

An example implementation of components laid out this way:

```tsx
// pages/some/page.tsx
import SomePageView from 'views/some-page'
import SomeLayout from 'layouts/some-layout'

// if we need to adjust props, can wrap this to make any changes necessary
const SomePage = SomePageView
SomePage.layout = SomeLayout

export default SomePage
```

## Configuration

Per-environment configuration values are defined in JSON files in the `config/` folder. Each environment has its own config file, currently:

```
config/
  base.json # Not used directly (see below)
  development.json
  preview.json
  production.json
```

Each configuration can define an `extends` property, which will cause it to merge its properties with the extended configuration file. If no `extends` property is explicitly defined, the configuration file will extend from `base.json`.

The configuration values are available globally within the application. They can be accessed from a global `__config` object:

```js
// config file:
{
   "my_config_value": "foo"
}

// in code:
console.log(__config.my_config_value)
```

Configuration files should be used for any non-sensitive configuration values needed throughout the application which might vary by environment. Consider API endpoints, constants, and flags in scope for the configuration files.

## Analytics

Calls to `window.analytics.track()` are logged in development for easy iteration while adding analytics code. If you would prefer to reduce the noise created by these logs, start the app with `NEXT_PUBLIC_ANALYTICS_LOG_LEVEL=0`:

```
$ NEXT_PUBLIC_ANALYTICS_LOG_LEVEL=0 npm start
```

## SEO Metadata

The meta tags for the site are rendered by the [`HeadMetadata`](./src/components/head-metadata/index.tsx) component. Each page which uses `getStaticProps` can return a `metadata` property in its prop object to control the metadata which is ultimately rendered. The root site title is defined in our base config under `dev_dot.meta.title`.

```ts
export async function getStaticProps() {
	return {
		props: {
			metadata: {
				title: 'My Page', // Will be joined with the root site title
				description: 'This is a cool page',
			},
		},
	}
}
```

Social card images / OpenGraph images live in [`/public/og-image/`](./public/og-image/). Each product should have a `{product}.jpg` file in that folder for its generic card image.

## Performance

### Next Bundle Analysis

We use the [Next.js Bundle Analysis GitHub Action](https://github.com/hashicorp/nextjs-bundle-analysis) to track the size of our JavaScript bundles generated by Next.js's build step. To speed up the execution of the analysis step, we also have a [custom build script](./scripts/next-build-webpack-only.ts) which prevents the execution of the static generation build step, short-circuiting the Next.js build after the webpack compilation is finished.

## Remote Content & Application context

This application pulls content from multiple different repositories (remote content) through our Learn API, content API, as well as directly from the GitHub API. In order to facilitate development and previewing of this content, the application can be run within the context of one of these source repositories. In this scenario, we want to read
content from the filesystem for that specific source. This can be distilled down into three specific contexts that need to be handled for any remote content:

- Running the application in this repository (`hashicorp/dev-portal`): all content is sourced remotely
- Running the application in a content's source repository (e.g. vault docs in `hashicorp/vault`): all content from the repository is read from the file system
- Running the application in a different source repository (e.g. waypoint docs in `hashicorp/vault`): content is sourced remotely if not from the current context

> Note: For content which is read from the GitHub API, we try to minimize loading this content from the API in source repositories to reduce reliance on GitHub PATs

If you are wiring up remote data which needs to change its loading strategy depending on the context, you can use `isDeployPreview()` from `lib/env-checks`:

```ts
import { isDeployPreview } from 'lib/env-checks'

isDeployPreview() // in any source repository?
isDeployPreview('vault') // in vault's source repository?
```

## Proxied Redirects

The Next.js application deployed from this repository serves multiple domains. To enable defining redirects specifically for these domains, we automatically load redirects from the `./proxied-redirects` folder. Each file in this folder must have its name in the format `{domain}.redirects.js`, where `{domain}` is the domain that the redirects are applied to.

The redirects file should be in the CommonJS JavaScript module format. The export from the file should be [Next.js redirect definitions](https://nextjs.org/docs/api-reference/next.config.js/redirects). Example:

```js
// www.waypointproject.io.redirects.js

module.exports = [
	{
		source: '/home',
		destination: '/',
		permanent: true,
	},
]
```

The above redirect definition would be applied when the host matches `www.waypointproject.io`. The redirects can also be validated in lower environments by specifying the same host in the `hc_dd_proxied_site` cookie.
