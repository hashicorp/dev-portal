# Flags

This document gives an overview of `flags` set in `config`. Intent is that this documentation might help with understanding, maintaining, and deprecating `flags` through their lifecycle.

- `enable_api_docs_beta_label` - if `true`, `Beta` labels will be shown for `api-docs-view` operation objects and parameters marked with `x-beta-feature` metadata. If `false`, `x-beta-feature` data on operation objects and parameters is ignored.
- 🔪 `enable_datadog` - seems to be unused, once confirmed, we can likely remove this flag entirely
- 🔪 `enable_io_beta_cta` - seems to be unused, once confirmed, we can likely remove this flag entirely
