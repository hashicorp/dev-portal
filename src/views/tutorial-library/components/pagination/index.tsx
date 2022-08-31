import { IconArrowLeft16 } from '@hashicorp/flight-icons/svg-react/arrow-left-16'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import ButtonLink from 'components/button-link'
import Button from 'components/button'
import { usePagination } from 'react-instantsearch-hooks-web'

import paginationStyle from './pagination.module.css'
import { ButtonLinkProps } from 'components/button-link/types'

/**
 * @TODO de-duplicate some of the link generation, especially on either side of the pages array
 * @TODO scroll to top of page after paging
 */
export function Pagination() {
	const {
		pages,
		currentRefinement: currentPage,
		isFirstPage,
		isLastPage,
		refine,
		nbPages,
		createURL,
	} = usePagination({ padding: 2 })

	const previousButtonProps: Omit<ButtonLinkProps, 'onClick'> = {
		'aria-label': 'Go to previous page',
		icon: <IconArrowLeft16 />,
		color: 'secondary',
		className: paginationStyle.pageButton,
		size: 'small',
		href: createURL(currentPage - 1),
	}

	const nextButtonProps: Omit<ButtonLinkProps, 'onClick'> = {
		'aria-label': 'Go to next page',
		icon: <IconArrowRight16 />,
		color: 'secondary',
		className: paginationStyle.pageButton,
		size: 'small',
		href: createURL(currentPage + 1),
	}

	const showRestLastPage = !pages.includes(nbPages - 1)
	const showRestFirstPage = !pages.includes(0)

	return (
		<ul className={paginationStyle.root}>
			<li>
				{isFirstPage ? (
					<Button disabled {...previousButtonProps} />
				) : (
					<ButtonLink
						{...previousButtonProps}
						onClick={(e) => {
							e.preventDefault()
							refine(currentPage - 1)
						}}
					/>
				)}
			</li>
			{showRestFirstPage ? (
				<>
					<li>
						<ButtonLink
							aria-label={`Go to page 1`}
							text={String(1)}
							href={createURL(0)}
							color="secondary"
							className={paginationStyle.pageButton}
							size="small"
							onClick={(e) => {
								e.preventDefault()

								refine(0)
							}}
						/>
					</li>
					<li>
						<Button disabled size="small" text="..." />
					</li>
				</>
			) : null}
			{pages.map((page) => (
				<li key={page}>
					<ButtonLink
						aria-label={`Go to page ${page + 1}`}
						text={String(page + 1)}
						href={createURL(page)}
						color={page === currentPage ? 'primary' : 'secondary'}
						className={paginationStyle.pageButton}
						size="small"
						onClick={(e) => {
							e.preventDefault()

							refine(page)
						}}
					/>
				</li>
			))}
			{showRestLastPage ? (
				<>
					<li>
						<Button disabled size="small" text="..." />
					</li>
					<li>
						<ButtonLink
							aria-label={`Go to page ${nbPages}`}
							text={String(nbPages)}
							href={createURL(nbPages - 1)}
							color="secondary"
							className={paginationStyle.pageButton}
							size="small"
							onClick={(e) => {
								e.preventDefault()

								refine(nbPages - 1)
							}}
						/>
					</li>
				</>
			) : null}
			<li>
				{isLastPage ? (
					<Button disabled {...nextButtonProps} />
				) : (
					<ButtonLink
						{...nextButtonProps}
						onClick={(e) => {
							e.preventDefault()
							refine(currentPage + 1)
						}}
					/>
				)}
			</li>
		</ul>
	)
}
