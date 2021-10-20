import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconFrown24 = forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M8.457 14.424C9.27 13.746 10.5 13 12 13s2.73.746 3.543 1.424c.413.344.738.687.961.944.126.145.25.294.36.451a.75.75 0 01-1.227.862h-.001v-.002a4.882 4.882 0 00-.265-.328 6.91 6.91 0 00-.789-.775C13.895 15.004 13 14.5 12 14.5c-1 0-1.895.504-2.582 1.076a6.21 6.21 0 00-1.054 1.104.75.75 0 01-1.228-.86 5.67 5.67 0 01.36-.452c.223-.257.548-.6.961-.944zM8 9a1 1 0 011-1h.01a1 1 0 110 2H9a1 1 0 01-1-1zM15 8a1 1 0 100 2h.01a1 1 0 100-2H15z" />
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
