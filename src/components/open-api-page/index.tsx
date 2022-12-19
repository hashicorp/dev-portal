import { useRef } from 'react'
import OperationObject from './partials/operation-object'
import HashiHead from '@hashicorp/react-head'
import DocsSidenav from '@hashicorp/react-docs-sidenav'
import Content from '@hashicorp/react-content'
import s from './style.module.css'

function OpenApiPageContents({
	info,
	operationCategory,
	massageOperationPathFn = (path) => path,
	renderOperationIntro,
}) {
	const operationsRef = useRef(null)

	if (operationCategory) {
		return (
			<div>
				<p className={s.pageHeading}>{info.title}</p>
				<h1 className={s.categoryHeading}>{operationCategory.name}</h1>
				<div ref={operationsRef}>
					{operationCategory.operations.map((op) => {
						return (
							<OperationObject
								key={op.__type + op.__path}
								path={massageOperationPathFn(op.__path)}
								type={op.__type}
								data={op}
								renderOperationIntro={renderOperationIntro}
							/>
						)
					})}
				</div>
			</div>
		)
	} else {
		return (
			<>
				<h1 className={s.pageHeading}>{info.title}</h1>
				<p className={s.sidebarPrompt}>Select a service from the sidebar.</p>
			</>
		)
	}
}

function OpenApiPage({
	info,
	operationCategory,
	navData,
	siteName,
	productSlug,
	currentPath,
	baseRoute,
	massageOperationPathFn = (path) => path,
	renderOperationIntro,
}) {
	const pageTitle = operationCategory ? operationCategory.name : info.title

	return (
		<div className={s.root}>
			<HashiHead
				title={`${pageTitle}${siteName ? ` | ${siteName}` : ''}`}
				description={info.description}
			/>
			<DocsSidenav
				product={productSlug}
				currentPath={currentPath}
				baseRoute={baseRoute}
				disableFilter={true}
				navData={navData}
			/>
			<Content
				className={s.contentContainer}
				product={productSlug}
				content={
					<OpenApiPageContents
						info={info}
						operationCategory={operationCategory}
						massageOperationPathFn={massageOperationPathFn}
						renderOperationIntro={renderOperationIntro}
					/>
				}
			/>
		</div>
	)
}

export { OpenApiPageContents }
export default OpenApiPage
