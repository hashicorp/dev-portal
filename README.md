# Dev Portal - dev.hashicorp.com

> 🚧 This project is in pre-alpha phase.

Welcome to the HashiCorp Developer Portal! This is the home for HashiCorp product reference documentation, along with all other kinds of content for our practitioners.

For background information on this project, refer to [[MKTG-034]](https://docs.google.com/document/d/1ASyBOCWWP8VUahbL5c5y0qrDMgqhYdXJ2h15xzh3JtA/edit#heading=h.spiwwyows3cr).

To track the progress of this project, refer to the [Dev Portal Asana Portfolio](https://app.asana.com/0/portfolio/1200682159451359/list) and join [#proj-dev-portal](https://hashicorp.slack.com/archives/C01KCU4HDPY) on slack.

## Local Development

### Setting Up Environment Variables

There are a few things you need to set up before you can begin developing in this repository.

1. [Install the Vercel CLI](https://vercel.com/cli)

   The CLI is needed for the next 2 steps.

2. Run `vercel link`

   This command will prompt you to connect your local copy of repo to [the Vercel `dev-portal` project](https://vercel.com/hashicorp/dev-portal). The command creates a `.vercel` directory with a JSON file that contains the information that links to the Vercel project.

3. Run `vercel env pull .env.local`

   This command will pull the development environment variables from the linked Vercel project and write them to a new file called `.env.local`.

### Running The Project

If you're developing in this repository, get started by running:

```
npm install
npm start
```

This will give you a development server running on [localhost:3000](http://localhost:3000).

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

## Documentation Content

Documentation for each product is sourced from its respective product repository, and served via Digital's [content API](https://github.com/hashicorp/mktg-content-workflows/#get-apicontentproductfullpath)
