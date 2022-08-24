type NativeLabelProps = JSX.IntrinsicElements['label']

type InheritedLabelProps = Pick<NativeLabelProps, 'className'>

interface LabelProps extends InheritedLabelProps {
	children: NativeLabelProps['children']
	fontWeight?: 'regular' | 'semibold'
	htmlFor: NativeLabelProps['htmlFor']
}

export type { LabelProps }
