# ADR 001: Env changes for Unified Docs

## Status

Proposed

## Context

We're currently working on implementing [[DEVDOT-023] Unified Product Documentation Repository](https://go.hashi.co/rfc/devdot-023). Our existing implementation involves fetching documentation content from `content.hashicorp.com`. Our new implementation involves creating a new service, currently prototyped in `hashicorp/web-presence-experimental-docs`, from which this application, `hashicorp/dev-portal`, will fetch documentation content.

To proceed with our work, we need to switch over to using the newly created service. Currently, the `dev-portal` application has a single `MKTG_CONTENT_API` environment variable. This environment variable serves multiple purposes, as it is used for:

1. docs content (ie version metadata, nav-data, and individual mdx documents)
2. docs assets (mostly images, which are referenced in MDX)
3. "static paths from analytics" - determines what we include in the small subset of pages that are rendered at build-time, selecting for the most-visited pages based on analytics

This single environment variable has some value, in that it provides us a clear mechanism to switch _all_ the purposes for _all_ docs content sources over to our new service. However, we intend to migrate our docs content sources gradually, and we do _not_ intend to immediately replace the `3. static paths from analytics` endpoint. The current environment variable setup does not make it easy for us to pursue a gradual migration to our new docs content service.

In addition, the new implementation we're proposing will handle `1.` (docs content) and `2.` (docs assets), but I don't think we have any short-term plans to try to handle `3.` (static paths from analytics) in our new service. It seems like it might be pragmatic to leave `3.` as part of `[content.hashicorp.com](http://content.hashicorp.com/)`. We will certainly want to make changes to `3.`, but it seems it can be safely cut from our scope, and handled separately, so that we can focus on other aspects of our new implementation and related migration work. The current environment variable setup does not provide an easy way to pursue migration of `1.` and `2.` separately from `3.`.

## Decision

We will update the`env` variables used in `dev-portal`. We will retain the existing `MKTG_CONTENT_API` variable, and will add `MKTG_CONTENT_DOCS_API` and `UNIFIED_DOCS_API` environment variables. These variables are intended to serve the following purposes

- `MKTG_CONTENT_API` - we'll retain this environment variable. We will keep it pointed at `[content.hashicorp.com](http://content.hashicorp.com/)`. Even after initial migration to our new unified docs service, we may continue using the env variable for all *non-docs* endpoints, namely for "static paths from analytics". Or we may choose to refactor such endpoints, in which case this environment variable may change in other ways.
- `MKTG_CONTENT_DOCS_API` - we'll introduce this new env variable. We'll refactor some code so that any endpoints that we *intend* to replace with the new unified docs API will now use this env variable. Before and during migration, we'll keep this pointed at `[content.hashicorp.com](http://content.hashicorp.com/)`. This env variable will be used for any products that are not yet on-boarded to the new API. When the migration to the unified docs API is fully complete, we'll no longer be using this env variable, and we'll be able to get rid of it.
- `UNIFIED_DOCS_API` - we'll introduce this new env variable, but it won't be used yet. When we're ready to migrate a specific docs section to the new unified docs API, we'll conditionally use this env variable instead of `MKTG_CONTENT_DOCS_API`. We may choose to use feature flags or a similar mechanism as part of the conditional use of this new env variable.

Note that these environment variables are all non-sensitive. The `MKTG_CONTENT_API` already exists in a version-tracked `.env` file. We will add `MKTG_CONTENT_DOCS_API` and `UNIFIED_DOCS_API` environment variables to this same `.env` file.

## Consequences

We will have the option to incrementally migrate specific parts of our documentation content to our new unified docs service, rather than having to migrate all docs content at once.

We will be able to address the "static paths from analytics" service separately from migrating our docs content service. We will still have the option to refactor that service, but doing so will no longer be tied to unified docs migration efforts.

The `dev-portal-internal` repository will automatically update with these new environment variables as part of our [repo-sync workflow](https://github.com/hashicorp/dev-portal/blob/main/.github/workflows/repo-sync.yml).

We expect there to be a slightly downside of additional complexity in our `.env` file. We expect the benefits of a more tightly scoped and incremental migration to outweigh this complexity. We also expect to be able to reduce this complexity post-migration.
