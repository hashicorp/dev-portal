/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { RewriteTutorialLinksPluginOptions } from '../types'
import { DEFAULT_CONTENT_TYPE } from '../constants'
import {
	getIsRewriteableDocsLink,
	rewriteExternalLearnLink,
	rewriteExternalDocsLink,
	getIsExternalLearnLink,
} from '.'

const getIsRelativeUrl = (url) => {
	try {
		new URL(url)
		return false
	} catch (e) {
		return true
	}
}

export function rewriteTutorialsLink(
	url: string,
	tutorialMap: Record<string, string>,
	contentType: RewriteTutorialLinksPluginOptions['contentType'] = DEFAULT_CONTENT_TYPE
): string {
	let newUrl

	try {
		const urlObject = new URL(url, 'https://learn.hashicorp.com')

		let isExternalLearnLink: boolean
		if (contentType === 'docs' && getIsRelativeUrl(url)) {
			isExternalLearnLink = false
		} else {
			isExternalLearnLink = getIsExternalLearnLink(url)
		}
		const isRewriteableDocsLink = getIsRewriteableDocsLink(url)

		/**
		 * Don't do anything if the link is ambiguous.
		 */
		if (isExternalLearnLink && isRewriteableDocsLink) {
			throw new Error(
				`[rewriteTutorialsLink] Found an ambiguous link: '${url}'`
			)
		}

		/**
		 * Return the url unmodified if it's not rewriteable.
		 */
		if (!isExternalLearnLink && !isRewriteableDocsLink) {
			return url
		}

		/**
		 * Handle the link based on the determined link type.
		 */
		if (isExternalLearnLink) {
			newUrl = rewriteExternalLearnLink(urlObject, tutorialMap)
		} else if (isRewriteableDocsLink) {
			newUrl = rewriteExternalDocsLink(urlObject)
		}

		/**
		 * If the link wasn't found in the map, default to original link. Could be
		 * a typo, it's up to the author to correct -- this feedback should help.
		 */
		if (!newUrl) {
			newUrl = isExternalLearnLink ? urlObject.toString() : url
			throw new Error(
				`[MDX rewriteTutorialsLink]: link could not be rewritten: ${url} \nIf the content at that link is MDX, please check all Learn and Docs .io links in the content to ensure they are correct.`
			)
		}
	} catch (e) {
		// we don't want an incorrect link to break the build
		console.error(e)
	}

	// Return the modified URL, or default to the original one
	return newUrl ?? url
}
