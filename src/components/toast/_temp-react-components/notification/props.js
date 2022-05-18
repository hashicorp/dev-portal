module.exports = {
  appearance: {
    description: 'Render on light or dark background.',
    type: 'string',
    required: false,
    options: ['light', 'dark'],
  },
  description: {
    description: 'The text that appears within the notification.',
    type: 'string',
    required: true,
  },
  cta: {
    type: 'object',
    required: true,
    properties: {
      title: {
        description: 'The text used within the link.',
        type: 'string',
        required: true,
      },
      url: {
        description: 'The url used within the link.',
        type: 'string',
        required: true,
      },
    },
  },
  onDismiss: {
    description: 'A function called when the close button is clicked.',
    type: 'function',
    required: true,
  },
}
