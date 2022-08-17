import s from './paragraph-block.module.css'

export function ParagraphBlock(props) {
	return (
		<div className={s.root}>
			<pre>
				<code>{JSON.stringify(props, null, 2)}</code>
			</pre>
		</div>
	)
}
