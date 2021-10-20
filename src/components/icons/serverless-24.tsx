import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconServerless24 = forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M5 17.75a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75z" />
          <path
            d="M1.78.72A.75.75 0 00.72 1.78l.629.63A2.74 2.74 0 001 3.75v4.5A2.75 2.75 0 003.75 11h6.19l2 2H3.75A2.75 2.75 0 001 15.75v4.5A2.75 2.75 0 003.75 23h16.5a2.74 2.74 0 001.34-.349l.63.63a.75.75 0 101.06-1.061L2.866 1.806 1.78.72zm.732 2.853a1.265 1.265 0 00-.012.177v4.5c0 .69.56 1.25 1.25 1.25h4.69L2.511 3.573zm17.915 17.915L13.439 14.5H3.75c-.69 0-1.25.56-1.25 1.25v4.5c0 .69.56 1.25 1.25 1.25h16.5c.06 0 .12-.004.177-.012z"
            fillRule="evenodd"
            clipRule="evenodd"
          />
          <path d="M6 1a.75.75 0 000 1.5h14.25c.69 0 1.25.56 1.25 1.25v4.5c0 .69-.56 1.25-1.25 1.25H14.5a.75.75 0 000 1.5h5.75A2.75 2.75 0 0023 8.25v-4.5A2.75 2.75 0 0020.25 1H6zM18 13a.75.75 0 000 1.5h2.25c.69 0 1.25.56 1.25 1.25V18a.75.75 0 001.5 0v-2.25A2.75 2.75 0 0020.25 13H18z" />
        </g>
      </svg>
    )
  }
)
