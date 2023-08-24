import CodeMirror from '@uiw/react-codemirror'
// Languages
import { json } from '@codemirror/lang-json'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
// Theme
import { githubDark as codeMirrorTheme } from '@uiw/codemirror-theme-github'
// Styles
import s from './code-mirror-input.module.css'

/**
 * Render a CodeMirror input that supports either `json` or `markdown` syntax
 * highlighting.
 */
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
