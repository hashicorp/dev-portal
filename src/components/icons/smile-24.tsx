import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconSmile24 = forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M7.362 14.693c.216.265.534.618.948.972.82.7 2.077 1.46 3.69 1.46s2.87-.76 3.69-1.46a7.647 7.647 0 001.199-1.3l.099-.145a.875.875 0 00-1.475-.942c-.071.107-.15.21-.232.31a5.898 5.898 0 01-.729.747c-.641.549-1.509 1.04-2.552 1.04-1.043 0-1.91-.491-2.552-1.04a5.894 5.894 0 01-.73-.747 4.012 4.012 0 01-.232-.31.875.875 0 00-1.474.942c.106.165.227.322.35.473zM8 9a1 1 0 011-1h.01a1 1 0 110 2H9a1 1 0 01-1-1zM15 8a1 1 0 100 2h.01a1 1 0 100-2H15z" />
          <path
            d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </g>
      </svg>
    )
  }
)
