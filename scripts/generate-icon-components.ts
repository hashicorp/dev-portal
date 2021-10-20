import fs from 'fs'
import path from 'path'
import cheerio from 'cheerio'
import { camelCase, startCase } from 'lodash'
import prettier from 'prettier'

const ICONS_PATH = path.join(process.cwd(), 'src', 'components', 'icons')

const ICONS_TYPES_FILE = `import { SVGAttributes } from 'react'

export interface IconProps extends SVGAttributes<SVGElement> {
  children?: never
  color?: string
}`

function generateComponentSource({ name, jsx }: { name: string; jsx: string }) {
  return `import { forwardRef } from 'react'
import { IconProps } from './types'
  
export const ${name} = forwardRef<SVGSVGElement, IconProps>(({ color = 'currentColor', ...props }, forwardedRef) => {
  return (
    ${jsx}
  )
})

${name}.displayName = '${name}'
`
}

function getComponentName(icon: string) {
  return `Icon${startCase(camelCase(icon)).replace(/ /g, '')}`
}

function getJSXFromSvgSource(svgSource: string) {
  const $ = cheerio.load(svgSource, { xmlMode: true })

  $('*').each((i, el) => {
    Object.keys(el.attribs).forEach((attrKey) => {
      if (attrKey.includes('-')) {
        $(el).attr(camelCase(attrKey), el.attribs[attrKey]).removeAttr(attrKey)
      }
      if (attrKey === 'class') {
        $(el).attr('className', el.attribs[attrKey]).removeAttr(attrKey)
      }
    })
  })

  $('svg').attr('props', '...').attr('ref', 'forwardedRef')

  return $.xml()
    .replace(/stroke=['|"]currentColor['|"]/g, 'stroke={color}')
    .replace(/fill=['|"]currentColor['|"]/g, 'fill={color}')
    .replace('props="..."', '{...props}')
    .replace('ref="forwardedRef"', 'ref={forwardedRef}')
}

async function formatFile(source: string, filepath: string) {
  const prettierConfig = await prettier.resolveConfig(filepath)
  return prettier.format(source, { ...prettierConfig, filepath })
}

async function main() {
  const flightSvgDirectory = path.join(
    process.cwd(),
    'node_modules',
    '@hashicorp/flight-icons/svg'
  )

  // Get a list of all icon files from the flight-icons package
  const icons = (
    await fs.promises.readdir(flightSvgDirectory, {
      withFileTypes: true,
    })
  )
    .filter((file) => file.isFile())
    .map((file) => file.name.replace('.svg', ''))

  await fs.promises.mkdir(ICONS_PATH, {
    recursive: true,
  })

  // Write the types file with our shared interface
  const typesFilePath = path.join(ICONS_PATH, 'types.ts')

  await fs.promises.writeFile(
    typesFilePath,
    await formatFile(ICONS_TYPES_FILE, typesFilePath)
  )

  let exports = ''

  for (const icon of icons) {
    // Read the raw SVG source and modify it to be valid JSX
    const svgSource = await fs.promises.readFile(
      path.join(
        process.cwd(),
        'node_modules',
        '@hashicorp/flight-icons/svg',
        `${icon}.svg`
      ),
      { encoding: 'utf-8' }
    )
    const jsx = getJSXFromSvgSource(svgSource)
    const name = getComponentName(icon)

    // Add the export for our index file
    exports = exports.concat('\n', `export { ${name} } from './${icon}'`)

    const componentFilePath = path.join(ICONS_PATH, `${icon}.tsx`)
    const componentSource = generateComponentSource({ name, jsx })

    await fs.promises.writeFile(
      componentFilePath,
      await formatFile(componentSource, componentFilePath)
    )
  }

  // Write the index file with all of the exports
  await fs.promises.writeFile(
    path.join(ICONS_PATH, 'index.ts'),
    exports.trim() + '\n'
  )
}

main()
