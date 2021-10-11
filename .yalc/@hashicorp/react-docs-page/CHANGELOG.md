# @hashicorp/react-docs-page

## 14.4.2

### Patch Changes

- [#388](https://github.com/hashicorp/react-components/pull/388) [`a906a8d`](https://github.com/hashicorp/react-components/commit/a906a8d0056bd85e2f875d397f104ea83cf66014) Thanks [@BRKalow](https://github.com/BRKalow)! - Adds styles for search hits and adds units to a variable so that it works in calc()

- Updated dependencies [[`a906a8d`](https://github.com/hashicorp/react-components/commit/a906a8d0056bd85e2f875d397f104ea83cf66014)]:
  - @hashicorp/react-search@6.1.1

## 14.4.1

### Patch Changes

- [#358](https://github.com/hashicorp/react-components/pull/358) [`ef6333f`](https://github.com/hashicorp/react-components/commit/ef6333fb7276a636daab9fe5d6d1289d2945169d) Thanks [@zchsh](https://github.com/zchsh)! - Support possibility of index page being included in nav-data.

* [#382](https://github.com/hashicorp/react-components/pull/382) [`cc46ed6`](https://github.com/hashicorp/react-components/commit/cc46ed6e66c49e7ed777621f4b4c6b978c182e86) Thanks [@thiskevinwang](https://github.com/thiskevinwang)! - This updates logic to check `process.env.ENABLE_VERSIONED_DOCS === 'true'` since environment variables are _always strings_.

  This should prevent some unintended behavior if ENABLE_VERSIONED_DOCS is parsed as a string `"false"`, but unintentionally evaluating to `truthy`

* Updated dependencies [[`ef6333f`](https://github.com/hashicorp/react-components/commit/ef6333fb7276a636daab9fe5d6d1289d2945169d)]:
  - @hashicorp/react-docs-sidenav@8.4.0

## 14.4.0

### Minor Changes

- [#373](https://github.com/hashicorp/react-components/pull/373) [`4a5204b`](https://github.com/hashicorp/react-components/commit/4a5204b089e103da6e307ceba830c2356b2a930b) Thanks [@thiskevinwang](https://github.com/thiskevinwang)! - construct githubFileUrl to be used w/ **Edit this page**

  - This links to the `main` branch file while on the latest version
  - This is hidden for non-latest versions

### Patch Changes

- Updated dependencies [[`fe1fe69`](https://github.com/hashicorp/react-components/commit/fe1fe696e981bd93c5bcf34329eb81b571f798c9)]:
  - @hashicorp/react-search@6.0.2

## 14.3.1

### Patch Changes

- [#375](https://github.com/hashicorp/react-components/pull/375) [`0124e48`](https://github.com/hashicorp/react-components/commit/0124e48c025bea16d16f7d5cbb89c39f21aa88f6) Thanks [@thiskevinwang](https://github.com/thiskevinwang)! - This removes a log statement that was breaking minor updates

## 14.3.0

### Minor Changes

- [#354](https://github.com/hashicorp/react-components/pull/354) [`929b9b4`](https://github.com/hashicorp/react-components/commit/929b9b408387c78030e5e570c3fcb9807ce862e0) Thanks [@thiskevinwang](https://github.com/thiskevinwang)! - `react-docs-page` now makes api-calls to the mktg-content-workflows' content api

  https://github.com/hashicorp/react-components/pull/360 refactored server code to TypeScript

### Patch Changes

- Updated dependencies [[`9b190b0`](https://github.com/hashicorp/react-components/commit/9b190b0b13beb1045825ee2b1eb560b84215c265)]:
  - @hashicorp/react-docs-sidenav@8.3.0

## 14.2.5

### Patch Changes

- [#362](https://github.com/hashicorp/react-components/pull/362) [`77e5712`](https://github.com/hashicorp/react-components/commit/77e5712336ebe5303ba9cdd0363fd13a7e7cb14f) Thanks [@BRKalow](https://github.com/BRKalow)! - Adjust prop interface to make showVersionSelect, additionalComponents, and showEditPage optional

## 14.2.4

### Patch Changes

- [#353](https://github.com/hashicorp/react-components/pull/353) [`8a83473`](https://github.com/hashicorp/react-components/commit/8a8347301747a36216338ec6c25ebf56db79b9cd) Thanks [@zchsh](https://github.com/zchsh)! - Patches an issue in @hashicorp/platform-docs-mdx related to Tabs styling.

## 14.2.3

### Patch Changes

- [#351](https://github.com/hashicorp/react-components/pull/351) [`a3358e6`](https://github.com/hashicorp/react-components/commit/a3358e665ca2711012697f7138df572e9629699b) Thanks [@BRKalow](https://github.com/BRKalow)! - - Updates @hashicorp/platform-docs-mdx package to one that relies on the latest versions of our components

## 14.2.2

### Patch Changes

- [#348](https://github.com/hashicorp/react-components/pull/348) [`4ac0276`](https://github.com/hashicorp/react-components/commit/4ac0276c28b767272fabe64ef69e2faeb83957f6) Thanks [@BRKalow](https://github.com/BRKalow)! - Adds back @hashicorp/versioned-docs dependency to docs-page as it is still used

## 14.2.1

### Patch Changes

- [#346](https://github.com/hashicorp/react-components/pull/346) [`14f7b1f`](https://github.com/hashicorp/react-components/commit/14f7b1f9818f33d1cbaadafea97a889cb7218dae) Thanks [@BRKalow](https://github.com/BRKalow)! - Update docs-page to depend on @hashicorp/react-version-select instead of @hashicorp/version-select

## 14.2.0

### Minor Changes

- [#342](https://github.com/hashicorp/react-components/pull/342) [`348434e`](https://github.com/hashicorp/react-components/commit/348434ee9490944626f77291082f8130c00a607a) Thanks [@thiskevinwang](https://github.com/thiskevinwang)! - feat(version-select): added `removeVersionFromPath` util
  feat(react-docs-page): use new VersionSelect; add test coverage; expose extra prop

### Patch Changes

- Updated dependencies [[`348434e`](https://github.com/hashicorp/react-components/commit/348434ee9490944626f77291082f8130c00a607a)]:
  - @hashicorp/version-select@0.2.0

## 14.1.0

### Minor Changes

- [#337](https://github.com/hashicorp/react-components/pull/337) [`40afe45`](https://github.com/hashicorp/react-components/commit/40afe45a59c8c7d6fcdc097dcf67b382e6b2543b) Thanks [@thiskevinwang](https://github.com/thiskevinwang)! - This converts DocsPage to TypeScript. There are no new changes to the component API!

## 14.0.3

### Patch Changes

- [#298](https://github.com/hashicorp/react-components/pull/298) [`4c3e3d1`](https://github.com/hashicorp/react-components/commit/4c3e3d1efdba091f1a38b69b209f581e814f0e57) Thanks [@zchsh](https://github.com/zchsh)! - Converts Search to CSS modules, and makes tweaks in consuming components to account for related changes.

  - 💥✨ BREAKING CHANGE: Refactored to CSS modules.
    - Consumers will need to remove any `@hashicorp/react-search/style.css` imports.
    - For `.hit-content`, consumers will need to import `@hashicorp/react-search/hit-content-styles.module.css`, and use `s.root` on their `renderHitContent` container.

- Updated dependencies [[`4c3e3d1`](https://github.com/hashicorp/react-components/commit/4c3e3d1efdba091f1a38b69b209f581e814f0e57)]:
  - @hashicorp/react-docs-sidenav@8.2.5
  - @hashicorp/react-search@6.0.0
