/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { escape, split } from './shellwords'

/**
 * Given a snippet of code,
 * process it based on the detected language,
 * returning a modified snippet that has is
 * more suited to direct execution.
 */
function processSnippet(snippet: string): string {
	const isShell = snippet.split('\n')[0].startsWith('$ ')
	return isShell ? parseShellSnippet(snippet) : snippet
}

/**
 * Given a snippet of shell code that begins with `$ `,
 * return the snippet with all non-executable shell-symbols removed
 */
function parseShellSnippet(snippet: string): string {
	const lines = snippet.split('\n')
	/**
	 * Handle multi-line snippets.
	 *
	 * TODO: ideally we would detect many multi-line commands throughout
	 * a snippet. We could potentially build some complex string-based logic to
	 * do this... but it might be more efficient and effective to instead
	 * process the `code` passed to `HiddenCopyContent`:
	 * - We have incoming highlighted HTML or JSX, so we might be able to use
	 *   the highlight token classes (eg "shell-symbol") to only copy commands.
	 * - However, our highlighter currently doesn't distinguish between
	 *   "commands" and "output" tokens for the "shell-session" language...
	 *   So maybe complex string-based logic would be the way to go if
	 *   we want to support multiple multi-line commands in a single snippet?
	 * - Or maybe just need to look into `shellwords` use here?
	 *   (Full disclosure, I didn't set it up, so am not familiar.
	 *   it seems like it could be part of some solution?)
	 *
	 * ref: https://github.com/jimmycuadra/shellwords (really light on docs)
	 * ref: https://ruby-doc.org/stdlib-1.9.3/libdoc/shellwords/rdoc/Shellwords.html
	 *      (ruby module of same name, seems to have better docs)
	 *
	 * Related task:
	 * https://app.asana.com/0/1100423001970639/1199504357822173/f
	 *
	 */
	const firstLine = lines[0]
	const isMultiLineCommand =
		firstLine.endsWith('\\') || firstLine.endsWith('EOF')
	if (isMultiLineCommand) {
		/**
		 * If this is a multi-line snippet, return it formatted with
		 * shellwords escape & split
		 */
		const multiLineFmt = escape(snippet).replace('\\$\\', '')
		return split(multiLineFmt).join(' ')
	}
	/**
	 * Otherwise, we return only lines of the shell snippet that start with `$`.
	 * We remove the `$ ` at the start of each line.
	 * We lines that don't start with `$ ` - these are assumed to be output lines.
	 */
	const commandRegex = /^\$ /
	return lines
		.filter((line) => line.match(commandRegex))
		.map((line) => line.replace(commandRegex, ''))
		.join('\n')
}

export default processSnippet
