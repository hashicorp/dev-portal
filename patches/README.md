# `@hashicorp+react-docs-page+17.9.0.patch`

This patch is used to adjust `@hashicorp/react-docs-page` to use our "aliased" `next-mdx-remote-v1` dependency. This was to ultimately address an issue with multiple `next-mdx-remote` dependencies being included and causing build issues for `swingset`'s nested `next-mdx-remote` version. More details can be found in [#2036](https://github.com/hashicorp/dev-portal/pull/2036).
