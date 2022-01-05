# `@axe-core/react`

This doc details the usage of [`@axe-core/react`](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/react#axe-corereact) in the `dev-portal` repository.

## What is `@axe-core/react`?

`@axe-core/react` is a package that allows us to run accessibility checks against the rendered DOM and see results in a browser dev tools console.

_\*\* Note: it is recommended to use Chrome. There is limited functionality in Safari and Firefox_

## Why is it used in `dev-portal`?

We use it for local accessibility testing of the DOM. It does not replace other tools like linting rules and tools like linting rules also do not replace this tool. Both kinds of tools are important for different reasons. Linters can help us write accessible code and form good habits, but they can't check the full output of the code. Tools that check the DOM ensure that the final state of elements is accessible including all calculated text and colors.

## How do I use it as a development tool?

The code is set up in [`_app.tsx`](/src/pages/_app.tsx) to only use `react-dom` and `@axe-core/react` if the `AXE_ENABLED` environment variable is set. We've added an npm script to make setting that variable easy. To run the app locally with `@axe-core/react` enabled, run the following command in your terminal instead of `npm start`:

```
npm run start:withAxe
```

After you've got the project running locally with `AXE_ENABLED` set, you can open a browser to the local server and look at the dev tools console and inspect the console logs output by `@axe-core/react`.
