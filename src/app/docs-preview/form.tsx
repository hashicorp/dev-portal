'use client'

import { useRef, useState, type ChangeEventHandler } from 'react'
import { useFormState } from 'react-dom'
import { compileMdx } from './action'
import DevDotContent from '@components/dev-dot-content'
import Button from '@components/button'
import s from './form.module.css'
import { MdxInlineAlert } from '@components/dev-dot-content/mdx-components'

interface FormState {
	compiledSource?: string
	error?: string | null
}

const initialState: FormState = {
	compiledSource: '',
	error: null,
}

function AutoExpandingTextarea() {
	const ref = useRef<HTMLTextAreaElement>(null)
	const [numberOfLines, setNumberOfLines] = useState(8)

	const onChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
		const textarea = e.target
		const content = textarea.value
		const numberOfLines = content.split('\n').length
		setNumberOfLines(Math.max(8, numberOfLines))
	}

	return (
		<textarea
			name="source"
			spellCheck="false"
			ref={ref}
			onChange={onChange}
			rows={Math.max(numberOfLines, 8)}
		/>
	)
}

export default function Form() {
	const [state, formAction] = useFormState(compileMdx, initialState)

	return (
		<div className={s.formContainer}>
			<form className={s.form} action={formAction}>
				<Button type="submit" text="Compile" />
				<AutoExpandingTextarea />
			</form>
			{state.compiledSource && (
				<DevDotContent
					className={s.content}
					mdxRemoteProps={{ compiledSource: state.compiledSource }}
				/>
			)}
			{state.error && (
				<MdxInlineAlert title="MDX Compilation Error" type="warning">
					{state.error}
				</MdxInlineAlert>
			)}
		</div>
	)
}
