/// <reference types="@hashicorp/platform-types" />

declare module '*.scss'

declare module '*.svg' {
	const content: { src: string }
	export default content
}
