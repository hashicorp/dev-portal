import { Schema, ValidationErrorItem } from 'joi'

export function validateAgainstSchema<T>(
  data: unknown,
  JoiSchema: Schema,
  sourceFile: string
): data is T {
  const { error } = JoiSchema.validate(data, {
    allowUnknown: false,
    abortEarly: false,
  })
  // If there are no errors, we can assert that data is <T>
  if (!error) {
    return true
  }
  // Otherwise, format an error message to try to be helpful, then throw it.
  let validationError = `Error: Content looks invalid for "${sourceFile}".\n`
  validationError += `Please resolve the following issues:\n\n`
  validationError += '---\n\n'
  validationError += error.details
    .map((errorDetail: ValidationErrorItem, idx: number) => {
      let output = ''
      const { message, context } = errorDetail
      output += `Issue ${idx + 1} of ${error.details.length}:\n`
      output += message + '.\n'
      if (context) {
        output += `Context:\n`
        output += JSON.stringify(context, null, 2) + '\n\n'
      }
      return output
    })
    .join('---\n\n')
  throw new Error(validationError)
}
