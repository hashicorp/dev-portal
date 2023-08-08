# HashiCorp Developer - developer.hashicorp.com

Welcome to HashiCorp Developer! This is the home for HashiCorp product reference documentation and tutorials for our practitioners. For background information on this project, refer to [[MKTG-034]](https://docs.google.com/document/d/1ASyBOCWWP8VUahbL5c5y0qrDMgqhYdXJ2h15xzh3JtA/edit#heading=h.spiwwyows3cr).

> **Content Authors** Please see [this documentation](./src/content/README.md) for contributing content updates to Developer. Reach out in [#proj-dev-portal](https://hashicorp.slack.com/archives/C01KCU4HDPY) on Slack if you have any issues / questions.

## Table of contents

- [Local Development](#local-development)
- [Accessibility](#accessibility)
- [Testing](#testing)
- [Helpers](#helpers)
- [Component Organziation](#component-organization)
- [Configuration](#configuration)
- [Analytics](#analytics)
- [SEO metadata](#seo-metadata)
- [Performance](#performance)
- [Remote Content & Application context](#remote-content--application-context)
- [Proxied Redirects](#proxied-redirects)

## Local Development

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

> **Note**: Historically, the `.io` sites were served from this repository. They have been migrated into [the hashicorp/web repository](https://github.com/hashicorp/web). See [this RFC](https://docs.google.com/document/d/1iLx2jL09YkLbhSXdK9ScSedwSiujYDEa524FejOAnZM/) for full context.

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

## Accessibility

`@axe-core/react` is a package that allows us to run accessibility checks against the rendered DOM and see results in a browser dev tools console.

_\*\* Note: it is recommended to use Chrome. There is limited functionality in Safari and Firefox_

### Why is it used in `dev-portal`?

We use it for local accessibility testing of the DOM. It does not replace other tools like linting rules and tools like linting rules also do not replace this tool. Both kinds of tools are important for different reasons. Linters can help us write accessible code and form good habits, but they can't check the full output of the code. Tools that check the DOM ensure that the final state of elements is accessible including all calculated text and colors.

### How do I use it as a development tool?

The code is set up in [`_app.tsx`](/src/pages/_app.tsx) to only use `react-dom` and `@axe-core/react` if the `AXE_ENABLED` environment variable is set. We've added an npm script to make setting that variable easy. To run the app locally with `@axe-core/react` enabled, run the following command in your terminal instead of `npm start`:

```
npm run start:with-axe
```

After you've got the project running locally with `AXE_ENABLED` set, you can open a browser to the local server and look at the dev tools console and inspect the console logs output by `@axe-core/react`.

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

## Helpers

### Reset with `clean`

Auto-populated subdirectories such as `.next` and `node_modules` can sometimes become out of date. Delete all related subdirectories with the `clean` command.

```
npm install
npm run clean
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
  - **Note**: In support of future app-router adoption, we are no longer using the `.layout` or `.getLayout` pattern, which is not supported in the app directory.
- **`hooks`** - Shared hooks which are applicable for use across a variety of other components. Hooks which access shared contexts should live in `contexts/` (see below)
- **`contexts`** - Shared [contexts](https://reactjs.org/docs/context.html) and utilities for accessing / interacting with the context values

An example implementation of components laid out this way:

```tsx
// pages/some/page.tsx
import SomePageView from 'views/some-page'
import SomeLayout from 'layouts/some-layout'

// if we need to adjust props, can wrap this to make any changes necessary
export default function SomePage(props) {
	return (
		<SomeLayout>
			<SomePageView {...props} />
		</SomeLayout>
	)
}
```

## Configuration

Per-environment configuration values are defined in JSON files in the `config/` folder. Each environment has its own config file, controlled by the `HASHI_ENV` environment variable, currently:

```
config/
  base.json # May be used in any environment, including production (see below)
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

Configuration files should be used for any non-sensitive configuration values needed throughout the application which might vary by environment. Consider API endpoints, constants, and flags in scope for the configuration files. Any references to `__config` are replaced at build-time with the values from the environment's configuration file using [Webpack's DefinePlugin](https://webpack.js.org/plugins/define-plugin/).

## Search

We're using [Algolia](https://www.algolia.com/) to make the repository searchable. The search index is automatically updated when content changes are pushed in the various content repositories. The scripts to update the search index live in `mktg-content-workflows`: [docs](https://github.com/hashicorp/mktg-content-workflows/tree/main/workflows/update-search-index), [tutorials](https://github.com/hashicorp/mktg-content-workflows/tree/main/workflows/update-search-index-tutorials), and [integrations](https://github.com/hashicorp/mktg-content-workflows/tree/main/workflows/algolia-sync/sources/integrations).

The `main` branch and all preview builds use the production Algolia index, `prod_DEVDOT_omni`. To use the staging index, `staging_DEVDOT_omni`, update the [algolia config value](https://github.com/hashicorp/dev-portal/blob/3d0c59d51240798f42fd3ce79b9e30a47371784f/config/base.json#L11-L15).

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

This application pulls content from multiple different repositories (remote content) through our [Learn API](https://github.com/hashicorp/learn-api), [content API](https://github.com/hashicorp/mktg-content-workflows), [integrations API](https://github.com/hashicorp/integrations-api), from the local filesystem, as well as directly from the GitHub API. In order to facilitate development and previewing of this content, the application can be run within the context of one of these source repositories. In this scenario, we want to read
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
