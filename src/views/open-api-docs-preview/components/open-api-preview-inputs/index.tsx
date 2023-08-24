import { useState } from 'react'

const PLACEHOLDER_INPUT_DATA = {
	// basePath same no matter what, I think, preview tool is on static route
	basePath: '/openapi-docs-preview',
	// context is the same no matter what, no versioning, static route
	context: { params: { page: [] } },
	/**
	 * Product slug should be something preview tool users can control.
	 * TODO: allow control via an input, dropdown maybe?
	 */
	// productSlug: 'hcp',
	/**
	 * Status indicator should be controllable, optional.
	 * TODO: allow control via inputs
	 */
	statusIndicatorConfig: {
		pageUrl: 'https://status.hashicorp.com',
		endpointUrl:
			'https://status.hashicorp.com/api/v2/components/hk67zg2j2rkd.json',
	},
	/**
	 * navResourceItems should be controllable, optional.
	 * TODO: allow control via inputs
	 */
	navResourceItems: [
		{
			title: 'Tutorial Library',
			href: '/tutorials/library?product=vault&edition=hcp',
		},
		{
			title: 'Certifications',
			href: '/certifications/security-automation',
		},
		{
			title: 'Community',
			href: 'https://discuss.hashicorp.com/',
		},
		{
			title: 'Support',
			href: 'https://www.hashicorp.com/customer-success',
		},
	],
	/**
	 * Version data will be consistent no matter what, no versioning!
	 * This is where we need to pass the source file string though... and that
	 * source file string should be in the control of the preview tool user.
	 *
	 * TODO: add control for source file string via `versionData`.
	 */
	// Handle rename of `targetFile` to `openApiJsonString` for new template
	// versionData: [
	// 	{
	// 		versionId: 'latest',
	// 		openApiJsonString: JSON.stringify(HCP_VAULT_SECRETS_OPENAPI),
	// 	},
	// ],
	/**
	 * Massage the schema data a little bit, replacing
	 * "HashiCorp Cloud Platform" in the title with "HCP".
	 *
	 * TODO: figure out a way to pass this...
	 * Or not, maybe avoid exposing this to the preview tool?
	 */
	// massageSchemaForClient: (schemaData: OpenAPIV3.Document) => {
	// 	// Replace "HashiCorp Cloud Platform" with "HCP" in the title
	// 	const massagedTitle = schemaData.info.title.replace(
	// 		'HashiCorp Cloud Platform',
	// 		'HCP'
	// 	)
	// 	// Return the schema data with the revised title
	// 	const massagedInfo = { ...schemaData.info, title: massagedTitle }
	// 	return { ...schemaData, info: massagedInfo }
	// },
}

/**
 * TODO: write description
 */
function fakeVersionDataFromSourceFile(
	openApiJsonString: string,
	releaseStage: string = 'preview'
) {
	return [
		{
			versionId: 'preview-version-this-string-shouldnt-matter',
			releaseStage,
			sourceFile: openApiJsonString,
		},
	]
}

export function OpenApiPreviewInputs({ setStaticProps }: $TSFixMe) {
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [inputData, setInputData] = useState({
		productSlug: 'hcp',
		openApiJsonString: '',
		releaseStage: 'preview',
	})

	async function fetchStaticProps() {
		console.log('fetching static props...')
		const versionData = fakeVersionDataFromSourceFile(
			inputData.openApiJsonString,
			inputData.releaseStage
		)
		const result = await fetch('/api/get-openapi-view-props', {
			method: 'POST',
			body: JSON.stringify({
				...PLACEHOLDER_INPUT_DATA,
				productSlug: inputData.productSlug,
				versionData,
			}),
		})
		const resultData = await result.json()
		setStaticProps(resultData)
	}

	return (
		<div
			style={{
				position: 'fixed',
				right: 0,
				top: 0,
				width: '320px',
				border: '1px solid magenta',
				minHeight: '100vh',
				background: 'black',
				padding: '1rem',
				transform: isCollapsed ? 'translateX(100%)' : 'none',
			}}
		>
			<div>
				<label htmlFor="productSlug">productSlug</label>
				<br />
				<input
					id="productSlug"
					type="text"
					onChange={(e) =>
						setInputData((p) => ({ ...p, productSlug: e.target.value }))
					}
					value={inputData.productSlug}
				/>
			</div>
			<div>
				<label htmlFor="releaseStage">releaseStage</label>
				<br />
				<input
					id="releaseStage"
					type="text"
					onChange={(e) =>
						setInputData((p) => ({ ...p, releaseStage: e.target.value }))
					}
					value={inputData.releaseStage}
				/>
			</div>
			<div>
				<label htmlFor="openApiJsonString">openApiJsonString</label>
				<br />
				<textarea
					style={{ width: '100%', height: '200px', resize: 'vertical' }}
					id="openApiJsonString"
					onChange={(e) =>
						setInputData((p) => ({ ...p, openApiJsonString: e.target.value }))
					}
					value={inputData.openApiJsonString}
				/>
			</div>
			<p>
				<button onClick={() => fetchStaticProps()}>Generate preview</button>
			</p>
			<p>
				TODO: lots more inputs to add, still lots of HCP Vault Secrets
				placeholder here.
			</p>
			<div
				style={{
					position: 'absolute',
					bottom: '1rem',
					right: 'calc(100% + 1rem)',
				}}
			>
				<button
					onClick={() => setIsCollapsed((p) => !p)}
					style={{ padding: '2rem', borderRadius: '50%', border: 'none' }}
				>
					{isCollapsed ? 'Show' : 'Hide'} preview inputs
				</button>
			</div>
		</div>
	)
}
