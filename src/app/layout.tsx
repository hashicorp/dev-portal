'use client'
import { QueryParamProvider } from 'use-query-params'
import NextAdapterApp from 'next-query-params/app'

// import '@reach/dialog/styles.css'
import './global.css'

interface RootLayoutProps {
	children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en">
			<head />
			<body>
				<QueryParamProvider adapter={NextAdapterApp}>
					{children}
				</QueryParamProvider>
			</body>
		</html>
	)
}
