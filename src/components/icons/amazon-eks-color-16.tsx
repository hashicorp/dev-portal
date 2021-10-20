import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconAmazonEksColor16 = forwardRef<SVGSVGElement, IconProps>(
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
          fill="url(#amazon-eks-color-16__paint0_linear_879:141)"
          d="M6.381 10.148h.897V8.121l1.837 2.027h1.164L7.997 7.642l2.168-2.195H8.963L7.278 7.146V5.447h-.897v4.701z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
        <path
          fill="url(#amazon-eks-color-16__paint1_linear_879:141)"
          d="M8.532 3.803l3.186 1.81a.173.173 0 01.088.149v3.62c0 .06.033.118.088.149l2.842 1.615a.176.176 0 00.264-.15V3.947a.173.173 0 00-.088-.15L8.708.274a.176.176 0 00-.264.15v3.23c0 .062.034.119.088.15z"
        />
        <path
          fill="url(#amazon-eks-color-16__paint2_linear_879:141)"
          d="M11.273 10.288l-3.185 1.81a.178.178 0 01-.176 0l-3.63-2.062a.173.173 0 01-.088-.15V5.762c0-.062.034-.119.088-.15l3.186-1.81a.172.172 0 00.088-.15V.424a.176.176 0 00-.264-.15L1.088 3.798a.173.173 0 00-.088.15V11.7c0 .061.033.118.088.15l6.824 3.876c.054.03.122.03.176 0l6.204-3.524a.172.172 0 000-.3l-2.843-1.615a.178.178 0 00-.176 0z"
        />
        <defs>
          <linearGradient
            id="amazon-eks-color-16__paint0_linear_879:141"
            x1="10.691"
            x2="8.521"
            y1="9.879"
            y2="4.634"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#426DDB" />
            <stop offset="1" stopColor="#3B4BDB" />
          </linearGradient>
          <linearGradient
            id="amazon-eks-color-16__paint1_linear_879:141"
            x1="15.693"
            x2="9.546"
            y1="10.544"
            y2="-.213"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#426DDB" />
            <stop offset="1" stopColor="#3B4BDB" />
          </linearGradient>
          <linearGradient
            id="amazon-eks-color-16__paint2_linear_879:141"
            x1="9.433"
            x2="2.732"
            y1="14.904"
            y2="2.88"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#2775FF" />
            <stop offset="1" stopColor="#188DFF" />
          </linearGradient>
        </defs>
      </svg>
    )
  }
)
