import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconTerminalScreen24 = forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', ...props }, forwardedRef) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        {...props}
        ref={forwardedRef}
      >
        <g fill={color}>
          <path d="M6.174 7.27a.75.75 0 011.056-.096l4.5 3.75a.75.75 0 010 1.152l-4.5 3.75a.75.75 0 11-.96-1.152l3.809-3.174-3.81-3.174a.75.75 0 01-.095-1.056zM11.75 16a.75.75 0 000 1.5h5.5a.75.75 0 000-1.5h-5.5z" />
          <path
            d="M1 4.75A2.75 2.75 0 013.75 2h16.5A2.75 2.75 0 0123 4.75v14.5A2.75 2.75 0 0120.25 22H3.75A2.75 2.75 0 011 19.25V4.75zM3.75 3.5c-.69 0-1.25.56-1.25 1.25v14.5c0 .69.56 1.25 1.25 1.25h16.5c.69 0 1.25-.56 1.25-1.25V4.75c0-.69-.56-1.25-1.25-1.25H3.75z"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </g>
      </svg>
    )
  }
)
