async function fetchFileString(url) {
  const res = await fetch(url)
  const fileBuffer = await bufferFromStream(res.body)
  return fileBuffer.toString()
}

async function bufferFromStream(stream) {
  return new Promise((resolve, reject) => {
    const _buf = []
    stream.on('data', (chunk) => _buf.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(_buf)))
    stream.on('error', (err) => reject(err))
  })
}

module.exports = fetchFileString
