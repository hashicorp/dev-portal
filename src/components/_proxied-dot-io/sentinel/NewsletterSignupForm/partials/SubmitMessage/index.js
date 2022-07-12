import React from 'react'

const SubmitMessage = (props) => {
  const { submitStatus, theme } = props
  const success = submitStatus === 'success'
  const msgSuccess = 'Thanks for subscribing!'
  const msgError =
    "We’re having trouble getting you subscribed. Try again or reach out to <a href='mailto:hello@hashicorp.com'>hello@hashicorp.com</a>."
  return (
    <div
      className="submitted-msg"
      data-success={success.toString()}
      data-theme-bg={theme.background}
    >
      {submitStatus &&
        (success ? (
          <Temporary_SvgCheckCircle />
        ) : (
          <Temporary_SvgAlertTriangle />
        ))}
      {submitStatus && (
        <div
          className="g-type-body"
          dangerouslySetInnerHTML={{ __html: success ? msgSuccess : msgError }}
        />
      )}
    </div>
  )
}

export default SubmitMessage

/*

@TODO
Would like to split these SVGRs out,
will do so after https://github.com/hashicorp/web-components/pull/680 is merged

*/

const Temporary_SvgCheckCircle = (props) => (
  <div className="temporary_g-svg">
    <img
      className="svg-sizer"
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGElEQVR4Ae3BAQ0AAADCIPun/mYOYAAAXAkYAAHpgbOwAAAAAElFTkSuQmCC"
      alt=""
    />
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <g id="CheckCircle">
        <path
          id="Shape (Stroke)"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.7648 4.54512C11.0229 2.87783 6.63007 3.87034 3.96846 6.98441C1.30686 10.0985 1.01054 14.5923 3.24019 18.0289C5.46985 21.4655 9.69434 23.0262 13.6228 21.8647C17.5512 20.7032 20.2477 17.0962 20.2501 12.9996V12.07C20.2501 11.6558 20.5858 11.32 21.0001 11.32C21.4143 11.32 21.7501 11.6558 21.7501 12.07V13C21.7473 17.7609 18.6135 21.9533 14.0481 23.3032C9.4826 24.653 4.57306 22.8392 1.98184 18.8453C-0.609384 14.8514 -0.265011 9.62889 2.82821 6.00983C5.92142 2.39077 11.0266 1.23732 15.3753 3.17498C15.7537 3.34356 15.9237 3.78694 15.7551 4.1653C15.5865 4.54365 15.1432 4.7137 14.7648 4.54512Z"
          fill="black"
        />
        <path
          id="Shape (Stroke)_2"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.5303 3.46967C22.8232 3.76256 22.8232 4.23744 22.5303 4.53033L11.5303 15.5303C11.2374 15.8232 10.7626 15.8232 10.4697 15.5303L7.46967 12.5303C7.17678 12.2374 7.17678 11.7626 7.46967 11.4697C7.76256 11.1768 8.23744 11.1768 8.53033 11.4697L11 13.9393L21.4697 3.46967C21.7626 3.17678 22.2374 3.17678 22.5303 3.46967Z"
          fill="black"
        />
      </g>
    </svg>
  </div>
)

const Temporary_SvgAlertTriangle = (props) => (
  <div className="temporary_g-svg">
    <img
      className="svg-sizer"
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGElEQVR4Ae3BAQ0AAADCIPun/mYOYAAAXAkYAAHpgbOwAAAAAElFTkSuQmCC"
      alt=""
    />
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <g id="AlertTriangle">
        <path
          id="Shape (Stroke)"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.64853 4.47099C10.1471 3.64913 11.0385 3.14722 11.9998 3.14722C12.961 3.14722 13.8525 3.64913 14.351 4.47099L14.3532 4.47455L22.8294 18.6249C23.318 19.471 23.3208 20.513 22.8369 21.3619C22.3531 22.2108 21.4551 22.7392 20.478 22.7499L20.4698 22.75L3.52153 22.75C2.54448 22.7392 1.64649 22.2108 1.16262 21.3619C0.678749 20.513 0.681666 19.4711 1.17028 18.6249L1.17629 18.6145L9.64638 4.47456L9.64853 4.47099ZM10.932 5.24736C10.9317 5.24789 10.9313 5.24841 10.931 5.24893L2.46662 19.3796C2.24716 19.7634 2.24672 20.2348 2.46579 20.6191C2.68512 21.0039 3.09165 21.2438 3.53435 21.25H20.4652C20.9079 21.2438 21.3144 21.0039 21.5338 20.6191C21.7528 20.2348 21.7524 19.7634 21.5329 19.3796L13.0685 5.24893C13.0682 5.24841 13.0679 5.24789 13.0676 5.24736C12.8408 4.87472 12.4361 4.64722 11.9998 4.64722C11.5635 4.64722 11.1588 4.87472 10.932 5.24736Z"
          fill="black"
        />
        <path
          id="Shape (Stroke)_2"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 9.25C12.4142 9.25 12.75 9.58579 12.75 10V14C12.75 14.4142 12.4142 14.75 12 14.75C11.5858 14.75 11.25 14.4142 11.25 14V10C11.25 9.58579 11.5858 9.25 12 9.25Z"
          fill="black"
        />
        <path
          id="Ellipse"
          d="M13 18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18C11 17.4477 11.4477 17 12 17C12.5523 17 13 17.4477 13 18Z"
          fill="black"
        />
      </g>
    </svg>
  </div>
)
