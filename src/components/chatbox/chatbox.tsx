import { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
// https://helios.hashicorp.design/icons/library
import { IconLoading24 } from '@hashicorp/flight-icons/svg-react/loading-24'
import { IconSend24 } from '@hashicorp/flight-icons/svg-react/send-24'

import { useMutation } from '@tanstack/react-query'

const useAI = () => {
	const [streamedText, setStreamedText] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	// leverage useMutation to make a POST request more ergonomic
	// this returns a `ReadableStream<Uint8Array>`
	const mutation = useMutation({
		mutationFn: async (task: string) => {
			// clear previous response
			setStreamedText('...')
			setIsLoading(true)

			const response = await fetch('/api/chat/route', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					task: task,
				}),
			})
			// read incoming stream
			return response.body
		},
	})

	// when the mutation is successful, read the stream
	useEffect(() => {
		if (!mutation.data) {
			return
		}
		if (mutation.data.locked) {
			return
		}
		// reset streamed text
		setStreamedText('')

		// get the reader from the stream
		const reader = mutation.data.getReader()

		// decoder converts the Uint8Array to a human-readable string
		const decoder = new TextDecoder()

		// lift out an async function for easy calling within useEffect
		const processStream = async (
			rd: ReadableStreamDefaultReader<Uint8Array>
		) => {
			let shouldExit = false

			do {
				const { done, value } = await rd.read()
				// reached end of stream
				if (done) {
					rd.releaseLock()
					setIsLoading(false)
					shouldExit = true
					break
				}
				setStreamedText((prev) => prev + decoder.decode(value))
			} while (!shouldExit)
		}

		processStream(reader)
	}, [mutation.data])

	return {
		streamedText,
		isLoading,
		mutation,
	}
}

const ChatBox = () => {
	const { mutation, streamedText, isLoading } = useAI()

	const textContent = useRef<HTMLDivElement>(null)
	useEffect(() => {
		// scroll to bottom
		textContent.current?.scrollTo({
			top: textContent.current.scrollHeight,
			behavior: 'smooth',
		})
	}, [streamedText])

	return (
		<>
			<div
				style={{
					height: 350,
					width: 600,
					position: 'fixed',
					right: 50,
					bottom: 50,
					zIndex: 1000,
					padding: 20,
					background: 'var(--token-color-palette-neutral-100)',
					borderRadius: 10,
					display: 'flex',
					flexDirection: 'column',
					boxShadow: 'var(--token-surface-mid-box-shadow)',
				}}
			>
				<div style={{ flex: 1, overflowY: 'scroll' }} ref={textContent}>
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						components={{
							a: (props) => {
								return (
									<Link
										prefetch
										href={props.href as string}
										style={{
											...props.style,
											color: 'var(--token-color-palette-blue-300)',
										}}
									>
										{props.children}
									</Link>
								)
							},
						}}
					>
						{streamedText}
					</ReactMarkdown>
				</div>

				<form
					onSubmit={async (e) => {
						e.preventDefault()
						mutation.mutate(e.currentTarget.task.value)
					}}
				>
					<div style={{ display: 'flex', flexDirection: 'row' }}>
						<textarea
							rows={1}
							className={'hds-typography-body-200'}
							style={{
								resize: 'none',
								flex: 1,
								padding: 12,
								border:
									'1px solid var(--token-form-control-base-border-color-default)',
								borderRadius: 6,
							}}
							id="task"
							placeholder="Send a message"
						></textarea>
						<button
							disabled={isLoading}
							type="submit"
							style={{
								width: 46,
								height: 46,
								marginLeft: 6,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: 'var(--token-color-palette-neutral-0)',
								border:
									'1px solid var(--token-form-control-base-border-color-default)',
								borderRadius: 6,
							}}
						>
							{isLoading ? (
								<IconLoading24
									style={{
										animation:
											'hds-flight-icon-animation-rotation 9s linear infinite',
										animationDuration: '.7s',
									}}
								/>
							) : (
								<IconSend24 />
							)}
						</button>
					</div>
				</form>
			</div>
		</>
	)
}

export default ChatBox
