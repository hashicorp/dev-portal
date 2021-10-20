import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconMinusPlusCircle16 = forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', ...props }, forwardedRef) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 16 16"
        {...props}
        ref={forwardedRef}
      >
        <g fill={color}>
          <path d="M3.75 4.5a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3zM10.25 7.5a.75.75 0 01.75.75V9.5h1.25a.75.75 0 010 1.5H11v1.25a.75.75 0 01-1.5 0V11H8.25a.75.75 0 010-1.5H9.5V8.25a.75.75 0 01.75-.75z" />
          <path
            d="M5.25 0a5.25 5.25 0 015.244 5.006 5.25 5.25 0 11-5.488 5.488A5.25 5.25 0 015.25 0zM1.5 5.25a3.75 3.75 0 017.499-.1A5.258 5.258 0 005.15 8.999 3.75 3.75 0 011.5 5.25zm8.75 1.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </g>
      </svg>
    )
  }
)
