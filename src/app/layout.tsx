export default function AppLayout({ children }) {
	return (
		<html>
			<head>
				<title>HashiCorp Developer</title>
			</head>
			<body>{children}</body>
		</html>
	)
}
