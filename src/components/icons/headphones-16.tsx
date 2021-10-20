import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconHeadphones16 = forwardRef<SVGSVGElement, IconProps>(
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
        <path
          fill={color}
          d="M8 2.5c-1.468 0-2.87.56-3.9 1.548A5.13 5.13 0 002.5 7.75V8h1.25A2.25 2.25 0 016 10.25v2.5A2.25 2.25 0 013.75 15h-.5A2.25 2.25 0 011 12.75v-5c0-1.8.745-3.52 2.061-4.784A7.135 7.135 0 018 1c1.847 0 3.624.704 4.939 1.966A6.63 6.63 0 0115 7.75v5A2.25 2.25 0 0112.75 15h-.5A2.25 2.25 0 0110 12.75v-2.5A2.25 2.25 0 0112.25 8h1.25v-.25a5.13 5.13 0 00-1.6-3.702A5.635 5.635 0 008 2.5zm5.5 7h-1.25a.75.75 0 00-.75.75v2.5c0 .414.336.75.75.75h.5a.75.75 0 00.75-.75V9.5zm-11 0h1.25a.75.75 0 01.75.75v2.5a.75.75 0 01-.75.75h-.5a.75.75 0 01-.75-.75V9.5z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
