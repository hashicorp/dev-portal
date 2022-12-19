import { IconArrowLeft16 } from '@hashicorp/flight-icons/svg-react/arrow-left-16'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { usePagination } from 'react-instantsearch-hooks-web'
import ButtonLink from 'components/button-link'
import Button from 'components/button'
import { ButtonLinkProps } from 'components/button-link/types'
import Text from 'components/text'

import paginationStyle from './pagination.module.css'

/**
 * @TODO de-duplicate some of the link generation, especially on either side of the pages array
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
			<li className={paginationStyle.previousButton}>
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
			<li className="g-hide-on-desktop g-hide-on-tablet">
				<Text
					size={200}
					weight="regular"
					asElement="span"
					className={paginationStyle.pageInformation}
				>
					Page {currentPage + 1} of {nbPages}
				</Text>
			</li>
			{showRestFirstPage ? (
				<>
					<li className="g-hide-on-mobile">
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
					<li className="g-hide-on-mobile">
						<Button disabled size="small" text="..." />
					</li>
				</>
			) : null}
			{pages.map((page) => (
				<li key={page} className="g-hide-on-mobile">
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
					<li className="g-hide-on-mobile">
						<Button disabled size="small" text="..." />
					</li>
					<li className="g-hide-on-mobile">
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
			<li className={paginationStyle.nextButton}>
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
