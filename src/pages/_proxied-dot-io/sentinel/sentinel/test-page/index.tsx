import SentinelIoLayout from 'layouts/_proxied-dot-io/sentinel'

function TestPage() {
	return (
		<div style={{ border: '1px solid magenta' }}>
			Test page at /sentinel/test-page in Sentinel io
		</div>
	)
}

TestPage.layout = SentinelIoLayout

export default TestPage
