import type { Root } from 'mdast'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RemarkPluginOptions = Record<string, any>
/**
 * A RemarkPlugin is a function that,
 * given an options object,
 * returns a function that transforms an MDAST syntax tree.
 * MDAST: https://github.com/syntax-tree/mdast
 * Unified plugins: https://github.com/unifiedjs/unified#plugin
 */
export type RemarkPlugin = (
  options: RemarkPluginOptions
) => (tree: Root) => void
/**
 * A RemarkPluginEntry can be either
 * a RemarkPlugin (if no options are being provided),
 * or a [RemarkPlugin, RemarkPluginOptions] array
 * when options need to be provided.
 */
export type RemarkPluginEntry =
  | RemarkPlugin
  | [RemarkPlugin, RemarkPluginOptions]
