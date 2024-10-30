import { NextRequest } from 'next/server'

type Client = {
	id: string
	res: any
}

const clients: Client[] = []

function addClient(id: string, res: any): void {
	clients.push({ id, res })
}

function removeClient(id: string): void {
	const index = clients.findIndex((client) => client.id === id)
	if (index !== -1) {
		clients.splice(index, 1)
	}
}

function sendMessageToAllClients(obj: any): void {
	const jsonData = `data: ${JSON.stringify(obj)}\n\n`
	for (const client of clients) {
		client.res.write(jsonData)
	}
}

export async function POST() {
	if (process.env.NODE_ENV !== 'development') {
		return new Response('Not Found', { status: 404 })
	}

	sendMessageToAllClients({ reload: true })
	return new Response('Reload sent to all clients')
}

export async function GET(req: NextRequest) {
	if (process.env.NODE_ENV !== 'development') {
		return new Response('Not Found', { status: 404 })
	}

	const { searchParams } = new URL(req.url)
	const clientId = searchParams.get('id')

	if (!clientId) {
		return new Response('ID is required', { status: 400 })
	}

	const { readable, writable } = new TransformStream()
	const writer = writable.getWriter()
	const encoder = new TextEncoder()

	addClient(clientId, {
		write: (message: string) => writer.write(encoder.encode(message)),
		end: () => writer.close(),
	})

	req.signal.addEventListener('abort', () => {
		console.log(`Reload Client ${clientId} Disconnected`)
		removeClient(clientId)
		writer.close()
	})

	// Send to start the connection
	writer.write(encoder.encode('data: \n\n'))

	return new Response(readable, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive',
		},
	})
}