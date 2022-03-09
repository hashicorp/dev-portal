# Dev Portal - dev.hashicorp.com

> 🚧 This project is in pre-alpha phase.

Welcome to the HashiCorp Developer Portal! This is the home for HashiCorp product reference documentation, along with all other kinds of content for our practitioners.

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

Additionally, you can add a GitHub [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to prevent running into the GitHub's API rate limit for unauthenticated requests by adding `GITHUB_TOKEN` to your `.env.local`.

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

### Testing

We use [jest](https://jestjs.io/) to write unit tests for our code. We also have [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) integrated for writing tests against our rendered React components.

To run tests:

```
npm test
```

To run tests in watch mode:

```
npm run test:watch
```

### Component Organization

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

### Configuration

Per-environment configuration values are defined in JSON files in the `config/` folder. Each environment has its own config file, currently:

```
config/
  development.json
  preview.json
  production.json
```

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

## Performance

### Next Bundle Analysis

We use the [Next.js Bundle Analysis GitHub Action](https://github.com/hashicorp/nextjs-bundle-analysis) to track the size of our JavaScript bundles generated by Next.js's build step. To speed up the execution of the analysis step, we also have a [custom build script](./scripts/next-build-webpack-only.ts) which prevents the execution of the static generation build step, short-circuiting the Next.js build after the webpack compilation is finished.

## Documentation Content

Documentation for each product is sourced from its respective product repository, and served via Digital's [content API](https://github.com/hashicorp/mktg-content-workflows/#get-apicontentproductfullpath)
