const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default async function Page() {
	await sleep(3000)
	return <div>page.tsx</div>
}
