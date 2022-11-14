import MDX_COMPONENTS from 'components/mdx-components'

// This function returns a simple object containing the default components
// The `additionalComponents` param is purely for convenience.
// It is intended for use with `next-mdx-remote`.
export default function defaultMdxComponents({ additionalComponents = {} }) {
	return Object.assign(_defaultComponents(), additionalComponents)
}

// Purely for sharing between the two functions. Once `createMdxProvider` is
// deprecated, this can be moved inline.
function _defaultComponents() {
	return MDX_COMPONENTS
}
