/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { ThemeRegistrationResolved } from 'shiki'

export const theme: ThemeRegistrationResolved = {
	name: 'Helios',
	type: 'dark',
	bg: 'var(--hds-code-block-color-surface-primary)',
	fg: 'var(--hds-code-block-color-token)',
	settings: [
		{
			scope: [
				'keyword.operator.accessor',
				'meta.group.braces.round.function.arguments',
				'meta.template.expression',
				'markup.fenced_code meta.embedded.block',
			],
			settings: { foreground: 'var(--hds-code-block-color-token)' },
		},
		{ scope: 'emphasis', settings: { fontStyle: 'italic' } },
		{
			scope: ['strong', 'markup.heading.markdown', 'markup.bold.markdown'],
			settings: { fontStyle: 'bold' },
		},
		{ scope: ['markup.italic.markdown'], settings: { fontStyle: 'italic' } },
		{
			scope: 'meta.link.inline.markdown',
			settings: {
				fontStyle: 'underline',
				foreground: 'var(--hds-code-block-color-url)',
			},
		},
		{
			scope: ['string', 'markup.fenced_code', 'markup.inline'],
			settings: { foreground: 'var(--hds-code-block-color-string)' },
		},
		{
			scope: ['comment', 'string.quoted.docstring.multi'],
			settings: { foreground: 'var(--hds-code-block-color-comment)' },
		},
		{
			scope: [
				'constant.numeric',
				'constant.language',
				'constant.other.placeholder',
				'constant.character.format.placeholder',
				'variable.language.this',
				'variable.other.object',
				'variable.other.class',
				'variable.other.constant',
				'variable.other.enummember',
				'meta.property-name',
				'meta.property-value',
				'support',
			],
			settings: { foreground: 'var(--hds-code-block-color-constant)' },
		},
		{
			scope: [
				'keyword',
				'storage.modifier',
				'storage.type',
				'storage.control.clojure',
				'entity.name.function.clojure',
				'entity.name.tag.yaml',
				'support.function.node',
				'support.type.property-name.json',
				'punctuation.separator.key-value',
				'punctuation.definition.template-expression',
			],
			settings: { foreground: 'var(--hds-code-block-color-keyword)' },
		},
		{
			scope: 'variable.parameter.function',
			settings: { foreground: 'var(--hds-code-block-color-token)' },
		},
		{
			scope: [
				'support.function',
				'entity.name.type',
				'entity.other.inherited-class',
				'meta.function-call',
				'meta.instance.constructor',
				'entity.other.attribute-name',
				'entity.name.function',
				'constant.keyword.clojure',
			],
			settings: { foreground: 'var(--hds-code-block-color-function)' },
		},
		{
			scope: [
				'entity.name.tag',
				'string.quoted',
				'string.regexp',
				'string.interpolated',
				'string.template',
				'string.unquoted.plain.out.yaml',
				'keyword.other.template',
			],
			settings: { foreground: 'var(--hds-code-block-color-string)' },
		},
		{
			scope: [
				'punctuation.definition.arguments',
				'punctuation.definition.dict',
				'punctuation.separator',
				'meta.function-call.arguments',
			],
			settings: { foreground: 'var(--hds-code-block-color-punctuation)' },
		},
		{
			scope: ['punctuation.separator.prompt.shell-session'],
			settings: { foreground: 'var(--hds-code-block-color-cyan)' },
		},
		{
			scope: [
				'markup.underline.link',
				'punctuation.definition.metadata.markdown',
			],
			settings: { foreground: 'var(--hds-code-block-color-url)' },
		},
		{
			scope: ['beginning.punctuation.definition.list.markdown'],
			settings: { foreground: 'var(--hds-code-block-color-string)' },
		},
		{
			scope: [
				'punctuation.definition.string.begin.markdown',
				'punctuation.definition.string.end.markdown',
				'string.other.link.title.markdown',
				'string.other.link.description.markdown',
			],
			settings: { foreground: 'var(--hds-code-block-color-keyword)' },
		},
		// Diff
		{
			scope: ['markup.deleted'],
			settings: { foreground: 'var(--hds-code-block-color-deleted)' },
		},
		{
			scope: ['markup.inserted'],
			settings: { foreground: 'var(--hds-code-block-color-green)' },
		},
		{
			scope: [
				'punctuation.definition.deleted.diff',
				'punctuation.definition.inserted.diff',
			],
			settings: { foreground: 'var(--hds-code-block-color-token)' },
		},
		// TODO: We should map our code block colors to the correct scope:
		// https://github.com/hashicorp/design-system/blob/2c3c9a6a317255c3c8e22d72aa327eeaa7ccc7f3/packages/components/src/styles/components/code-block/theme.scss#L8
	],
}
