import { MdxInlineAlert } from '.'
import { MdxInlineAlertProps } from './types'

/**
 * Variants for composed authoring primitives.
 * Where the type doesn't need to be set.
 */

export function MdxTip(props: Omit<MdxInlineAlertProps, 'type'>) {
	return <MdxInlineAlert type="tip" {...props} />
}

export function MdxHighlight(props: Omit<MdxInlineAlertProps, 'type'>) {
	return <MdxInlineAlert type="highlight" {...props} />
}

export function MdxNote(props: Omit<MdxInlineAlertProps, 'type'>) {
	return <MdxInlineAlert type="note" {...props} />
}

export function MdxWarning(props: Omit<MdxInlineAlertProps, 'type'>) {
	return <MdxInlineAlert type="warning" {...props} />
}
