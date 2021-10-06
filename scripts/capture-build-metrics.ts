import path from 'path'
import fs from 'fs'

const traceFilePath = './.next/trace'

async function readNextTrace(cwd: string) {
  const filepath = path.join(cwd, traceFilePath)

  const content = await fs.promises.readFile(filepath, { encoding: 'utf-8' })

  const parts = content.trim().split('\n')

  return parts
}

const events = [
  'next-build',
  'run-webpack-compiler',
  'static-generation',
  'next-export',
]

function captureMetric({
  name,
  duration,
  timestamp,
  tags,
}: {
  name: string
  duration: number
  timestamp?: number
  tags?: string[]
}) {
  return {
    metric: name,
    points: [[timestamp ?? Date.now(), duration]],
    tags,
    type: 'gauge',
  }
}

async function main() {
  const [, , appName] = process.argv

  const timestamp = Date.now()
  const trace = await readNextTrace(process.cwd())

  const flatEvents = trace.map((part) => JSON.parse(part)).flat()

  const filteredEvents = flatEvents.filter((event) =>
    events.includes(event.name)
  )

  filteredEvents.forEach((event) => {
    console.log(
      captureMetric({
        name: `build.${event.name}`,
        duration: Math.round(event.duration / 1e3),
        timestamp,
        tags: [`app:${appName}`],
      })
    )
  })
}

main()
