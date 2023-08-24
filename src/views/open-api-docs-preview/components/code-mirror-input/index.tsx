import CodeMirror from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { json } from '@codemirror/lang-json'
import { languages } from '@codemirror/language-data'
import { githubDark as codeMirrorTheme } from '@uiw/codemirror-theme-github'

import s from './code-mirror-input.module.css'

export function CodeMirrorInput({
	value,
	setValue,
	language,
}: {
	value: string
	setValue: (v: string) => void
	language: 'json' | 'markdown'
}) {
	return (
		<CodeMirror
			className={s.root}
			value={value}
			theme={codeMirrorTheme}
			maxHeight="400px"
			minHeight="400px"
			extensions={
				language === 'json'
					? [json()]
					: [markdown({ base: markdownLanguage, codeLanguages: languages })]
			}
			onChange={setValue}
		/>
	)
}
