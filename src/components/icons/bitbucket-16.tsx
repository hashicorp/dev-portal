import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconBitbucket16 = forwardRef<SVGSVGElement, IconProps>(
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
          d="M1.403 2.15A.43.43 0 011.73 2l12.54.002a.43.43 0 01.424.496l-1.81 11.135a.43.43 0 01-.425.36H3.693a.585.585 0 01-.568-.478l-1.82-11.02a.425.425 0 01.098-.345zm5.203 7.814H9.41l.677-3.93H5.859l.747 3.93z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
