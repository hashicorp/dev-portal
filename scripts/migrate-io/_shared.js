const fs = require('fs')

function addProxyLayout(fileString, pageName) {
  const layoutName = 'BoundaryIoLayout'
  const layoutPath = 'layouts/_proxied-dot-io/boundary'
  return `import ${layoutName} from '${layoutPath}'\n${fileString.replace(
    `export default function ${pageName}`,
    `function ${pageName}`
  )}\n${pageName}.layout = ${layoutName}\nexport default ${pageName}\n`
}

async function editFile(filePath, editFn) {
  const contents = fs.readFileSync(filePath, 'utf8')
  const editedContents = await editFn(contents)
  fs.writeFileSync(filePath, editedContents, 'utf8')
}

module.exports = { addProxyLayout, editFile }
