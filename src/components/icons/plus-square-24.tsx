import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconPlusSquare24 = forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M11.75 6.75a.75.75 0 01.75.75V11H16a.75.75 0 010 1.5h-3.5V16a.75.75 0 01-1.5 0v-3.5H7.5a.75.75 0 010-1.5H11V7.5a.75.75 0 01.75-.75z" />
          <path
            d="M2 4.75A2.75 2.75 0 014.75 2h14a2.75 2.75 0 012.75 2.75v14a2.75 2.75 0 01-2.75 2.75h-14A2.75 2.75 0 012 18.75v-14zM4.75 3.5c-.69 0-1.25.56-1.25 1.25v14c0 .69.56 1.25 1.25 1.25h14c.69 0 1.25-.56 1.25-1.25v-14c0-.69-.56-1.25-1.25-1.25h-14z"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </g>
      </svg>
    )
  }
)
