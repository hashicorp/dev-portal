# A Note On This Signup Form

This signup form kind of glues `@hashicorp/react-marketo-form` into Dev Dot.

For context, form components in that package, such as inputs and checkboxes and buttons, are intended for use on marketing websites (<https://www.hashicorp.com>). Here in Dev Dot, we want the same underlying functionality that `@hashicorp/react-marketo-form` provides, like field validation, the `/api/marketo` route utilities, etc etc. But we need to make relatively slight tweaks to the form styles in order to more closely meet the mockups we have for Certifications work.

In the future, we should work with platform and core team developers to explore how we might modify `@hashicorp/react-marketo-form` to make the component portions more "headless" or something (so that we can use all the functional bits of that package, but apply our own dev dot components).
