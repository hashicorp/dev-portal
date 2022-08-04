export default function IntegrationsList({ integrations }) {
	return (
		<ul>
			{integrations.map((integration) => {
				return <li key={integration.id}>{integration.name}</li>
			})}
		</ul>
	)
}
