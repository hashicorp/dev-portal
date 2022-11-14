import s from './mdx-table.module.css'

/**
 * Lightweight wrapper around the native table element to encapsulate styles and enable horizontal overflow scrolling
 * along with full-width tables.
 */
export function MdxTable(props) {
	return (
		<div className={s.tableWrapper}>
			<table {...props} />
		</div>
	)
}
