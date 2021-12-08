# Newsletter Signup Form

A form used to sign up for the email newsletter

### Props

- `buttonText` (string) _[optional]_ - Text for the form's submit button
- `placeholder` (string) _[optional]_ - Placeholder text for the email input field.
- `placement` (option, ["mega-nav","footer","subscribe-module"]) - Used for analytics, tracked under `Newsletter Signup` as `signup_type` on form submission.
- `allowHorizontalLayout` (boolean) _[optional]_ - If true, submit button will be displayed to the right of the text input on viewports 768px wide and above. Defaults to `true`.
- `theme` (object) _[optional]_ - Controls the appearance of the form. `theme.background` should be one of `["light", "dark", "brand"]`.
- `submitEndpoint` (string) _[optional]_ - URL to which the form and analytics data will be `POST`ed. Intended for use in testing. Defaults to `https://util.hashicorp.com/forms/standard`.
- `finished` (function) _[optional]_ - Callback function to be called on success or on error after form submission is attempted. This function will be passed a single argument, being an object `{ error }`, where `error` is an error message string if the submission errored, or `null` if the submission was successful.

### Dependents

- `email-subscribe`
- `footer`
- `mega-nav`

### Depends On

- `hashi-button`
- `hashi-checkbox-input`
- `hashi-text-input`
- `localstorage-polyfill`
