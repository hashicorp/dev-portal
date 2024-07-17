/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import languageNames from './language-names.json'
import syntaxes from './syntaxes.json'

/*
Pretty names allow us to keep
a single source of truth on what language name
each syntax slug corresponds to.

These are separate from our syntax list, because
we likely want to show different names even for aliases
syntaxes, eg "html" => "HTML" and "svg" ==> "SVG" even
though both are aliases for the "markup" syntax.

We've set this up to include all languages in 
Dato. We can update this list to improve automatic
"pretty" names, eg for CodeTabs.

Note that if a "pretty" name isn't present,
consumers should have the option to use a custom
"pretty" name. For example, in CodeTabs, consumers
can pass an array of labels using the "tabs" prop.
*/
export function getLanguageName(slugOrAlias: string): string | null {
	// If there's a direct custom name match, use that
	const customName = languageNames[slugOrAlias]
	if (customName) return customName
	// If there's a custom name for the canonical slug, use that
	const canonicalSlug = getCanonicalSlug(slugOrAlias)
	const canonicalName = languageNames[canonicalSlug]
	if (canonicalName) return canonicalName
	// Return null otherwise, consumer should use fallback
	// (eg, just display slugOrAlias as the language name)
	return null
}

export function getCanonicalSlug(slugOrAlias: string): string | null {
	const syntaxSlugMatch = Object.keys(syntaxes).reduce((match, slug) => {
		// If we already have a match, stop looking
		if (match) return match
		// If the  canonical slug is a match, use that
		if (slug == slugOrAlias) return slug
		// If an alias is a match, use the canonical slug
		if (syntaxes[slug].indexOf(slugOrAlias) !== -1) return slug
		// Otherwise, keep looking
		return match
	}, null)
	return syntaxSlugMatch
}
