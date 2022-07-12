import React, { useState, useEffect } from 'react'
import { Formik, Field } from 'formik'

import getAnalytics from './helpers/getAnalytics'

import Button from '@hashicorp/react-button'
import CheckboxInput from '@hashicorp/react-checkbox-input'
import TextInput from '@hashicorp/react-text-input'

import SubmitMessage from './partials/SubmitMessage/index.js'

const EMAIL_STORAGE_KEY = 'prevVal_emailValue'

/**
 * Localized from legacy web-components — @hashicorp/react-newsletter-signup-form v.2.1.4
 */

function NewsletterSignupForm(props) {
  const [storedEmail, setStoredEmail] = useState('')
  const [submitStatus, setSubmitStatus] = useState(false)

  //  On mount only, try to retrieve a stored email
  useEffect(() => {
    require('@hashicorp/localstorage-polyfill/dist')
    let retrievedEmail = window.localStorage.getItem(EMAIL_STORAGE_KEY)
    if (retrievedEmail !== null) {
      setStoredEmail(retrievedEmail)
    }
    require('promise-polyfill').default // For use in handleSubmit
  }, [])

  //  Submit function for use with Formik
  async function handleSubmit(values, formikBag) {
    const { submitEndpoint, finished, placement, mailingList } = props
    const { setSubmitting } = formikBag
    setSubmitting(true)
    // Save submitted email for future use in other forms
    // (Note: done here rather than after onChange to ensure privacy consent)
    window.localStorage.setItem(EMAIL_STORAGE_KEY, values.email)
    // Gather and submit the form data, starting with analytics from queryString
    let formData = getAnalytics()
    // Add email field
    formData.email = values.email

    // If we do not provide a mailingList (or explicitly declare we want
    // to subscribe to the newsletter) add emailSignup, which will trigger
    // the Marketo event to sign the user up for the newsletter.
    if (!mailingList || mailingList == 'Newsletter') {
      formData.emailSignup = true
    } else {
      formData.mailingList = mailingList
    }

    //  Submit the form data
    let submitStatus, submitError
    try {
      const res = await fetch(submitEndpoint, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      const response = await res.json()
      if (response.error) {
        throw new Error(response.error)
      }
      submitStatus = 'success'
      submitError = null
    } catch (err) {
      // @TODO connect to an error reporting service?
      submitStatus = 'error'
      submitError = err
    }
    //  Update and callback based on submission results and errors
    setSubmitting(false)
    setSubmitStatus(submitStatus)
    // Call to Segment Analytics. Depends on presence of `placement` prop
    if (window && window.analytics && placement) {
      window.analytics.track('Newsletter Signup', { placement })
    }
    // Call the finished function to notify a parent element that form is done
    const hasCallback = finished && typeof finished === 'function'
    if (hasCallback) {
      finished({ error: submitError })
    }
  }

  const { placeholder, buttonText, theme, allowHorizontalLayout } = props
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ email: storedEmail, acceptPrivacy: false }}
      validate={validate}
      onSubmit={handleSubmit}
    >
      {(formikProps) => (
        <form
          className="g-newsletter-signup-form"
          onSubmit={formikProps.handleSubmit}
          data-allow-horizontal-layout={(!!allowHorizontalLayout).toString()}
          data-submitting={(!!formikProps.isSubmitting).toString()}
          data-submitted={(!!submitStatus).toString()}
        >
          <SubmitMessage submitStatus={submitStatus} theme={theme} />
          <div className="form-elements">
            <div className="inputs">
              <Field
                className="text-input"
                type="email"
                name="email"
                component={TextInput}
                placeholder={placeholder}
                theme={theme}
              />
              <Field
                className="checkbox-input"
                name="acceptPrivacy"
                label="I agree to HashiCorp’s <a href='https://www.hashicorp.com/privacy' target='_blank'>Privacy&nbsp;Policy</a>.*"
                component={CheckboxInput}
                theme={theme}
              />
            </div>
            <Button
              className="btn"
              type="submit"
              onClick={formikProps.submitForm}
              disabled={formikProps.isSubmitting}
              title={buttonText}
              theme={{
                brand: theme.brand,
                variant: theme.background === 'brand' ? 'secondary' : 'primary',
                background: theme.background,
              }}
            />
          </div>
        </form>
      )}
    </Formik>
  )
}

function validate(values) {
  let errors = {}
  if (!values.email || isValidEmail(values.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!values.acceptPrivacy) {
    errors.acceptPrivacy = 'You must agree to the privacy policy to continue.'
  }
  return errors
}

function isValidEmail(string) {
  return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(string)
}

NewsletterSignupForm.defaultProps = {
  allowHorizontalLayout: true,
  placeholder: 'Email address',
  buttonText: 'Subscribe to Newsletter',
  submitEndpoint: 'https://util.hashicorp.com/forms/standard',
  theme: {
    background: 'light',
  },
}

export default NewsletterSignupForm
