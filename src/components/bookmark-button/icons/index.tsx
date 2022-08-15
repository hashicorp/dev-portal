import s from './icons.module.css'

/**
 * We need these icon to be an inline svg so we can manipulate the colors of the
 * 'plus' & 'minus' sign lines based in the varying bookmark hover states
 *
 * These were made from the flight library:
 * - '@hashicorp/flight-icons/svg-react/bookmark-16'
 * - '@hashicorp/flight-icons/svg-react/bookmark-fill-16'
 * - '@hashicorp/flight-icons/svg-react/bookmark-add-16'
 * - '@hashicorp/flight-icons/svg-react/bookmark-remove-16'
 */

export function AddBookmarkIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={16}
			height={16}
			fill="none"
			viewBox="0 0 16 16"
			aria-hidden={true}
			className={s.icon}
		>
			<path
				fillRule="evenodd"
				d="M2 3.25A2.25 2.25 0 014.25 1h7.5A2.25 2.25 0 0114 3.25v10.83a1 1 0 01-1.478.878L8.12 12.564a.25.25 0 00-.238 0l-4.403 2.394A1 1 0 012 14.08V3.25zm2.25-.75a.75.75 0 00-.75.75v9.989l3.664-1.992a1.75 1.75 0 011.672 0l3.664 1.992V3.25a.75.75 0 00-.75-.75h-7.5z"
				clipRule="evenodd"
			/>
			<path
				id={s.addSymbol}
				d="M7.75 4a.75.75 0 01.75.75V6h1.25a.75.75 0 010 1.5H8.5v1.25a.75.75 0 01-1.5 0V7.5H5.75a.75.75 0 010-1.5H7V4.75A.75.75 0 017.75 4z"
			/>
		</svg>
	)
}

export function RemoveBookmarkIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={16}
			height={16}
			fill="none"
			viewBox="0 0 16 16"
			aria-hidden={true}
			className={s.icon}
		>
			<path d="M4.25 1A2.25 2.25 0 002 3.25v10.83a1 1 0 001.478.878l4.403-2.394a.25.25 0 01.238 0l4.403 2.394A1 1 0 0014 14.08V3.25A2.25 2.25 0 0011.75 1h-7.5z" />
			<path
				id={s.removeSymbol}
				d="M5.75 6a.75.75 0 000 1.5h4a.75.75 0 000-1.5h-4z"
			/>
		</svg>
	)
}
