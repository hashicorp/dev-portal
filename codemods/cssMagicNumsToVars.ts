// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - !! ran through npx !!
import { Transform } from 'css-codemod'

// IMPORTANT: Set tsconfig compiler option "target" to "ESNext" in order to run this in npx
// usage: npx css-codemod "./src/components/*.css" -t ./codemods/cssMagicNumsToVars.ts

const transformMap = {
	'4px': '--hdsplus-spacing-01', // 0.25rem
	'6px': '--hdsplus-spacing-02', // 0.375rem
	'8px': '--hdsplus-spacing-03', // 0.5rem
	'12px': '--hdsplus-spacing-04', // 0.75rem
	'16px': '--hdsplus-spacing-05', // 1rem
	'20px': '--hdsplus-spacing-06', // 1.25rem
	'24px': '--hdsplus-spacing-07', // 1.5rem
	'32px': '--hdsplus-spacing-08', // 2rem
	'40px': '--hdsplus-spacing-09', // 2.5rem
	'48px': '--hdsplus-spacing-10', // 3rem
	'56px': '--hdsplus-spacing-11', // 3.5rem
	'64px': '--hdsplus-spacing-12', // 4rem
	'72px': '--hdsplus-spacing-13', // 4.5rem
	'88px': '--hdsplus-spacing-14', // 5.5rem
	'96px': '--hdsplus-spacing-15', // 6rem
	'128px': '--hdsplus-spacing-16', // 8rem
	'144px': '--hdsplus-spacing-17', // 8.5rem
	'160px': '--hdsplus-spacing-18', // 10rem
}

const transformMapKeys = Object.keys(transformMap)

export const transform: Transform = (fileInfo, api) => {
	const root = api.parse(fileInfo.source)

	root.walkDecls((decl) => {
		// Replace any uses of the custom property in values.
		//  eg: `border: 2px solid var(--custom-prop);`
		const result = api.parseValue(decl.value)

		result.walk((value) => {
			if (value.type === 'word' && transformMapKeys.includes(value.value)) {
				// console.log(value)
				value.value = `var(${transformMap[value.value]})`
			}
		})

		decl.value = result.toString()
	})

	return root.toString()
}
