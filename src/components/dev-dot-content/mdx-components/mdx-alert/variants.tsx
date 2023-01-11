import { MdxInlineAlert } from '.'
import { MdxInlineAlertProps } from './types'

/**
 * Variants for composed authoring primitives.
 * Where the type doesn't need to be set.
 */

export function MdxTip(props: Omit<MdxInlineAlertProps, 'type'>) {
	return <MdxInlineAlert {...props} type="tip" />
}

export function MdxHighlight(props: Omit<MdxInlineAlertProps, 'type'>) {
	return <MdxInlineAlert {...props} type="highlight" />
}

export function MdxNote(props: Omit<MdxInlineAlertProps, 'type'>) {
	return <MdxInlineAlert {...props} type="note" />
}

export function MdxWarning(props: Omit<MdxInlineAlertProps, 'type'>) {
	return <MdxInlineAlert {...props} type="warning" />
}
