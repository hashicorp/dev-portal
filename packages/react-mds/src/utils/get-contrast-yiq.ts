/**
 * Calculates the contrast of an RGB color and determines whether to use dark or light text.
 * @param rgb - An object containing the red (r), green (g), and blue (b) components of the color.
 * @returns A string indicating whether to use 'dark' or 'light'.
 */
export const getContrastYIQ = (rgb: {
	r: number
	g: number
	b: number
}): string => {
	// Calculate the YIQ value using the RGB components
	const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
	// If YIQ is greater than or equal to 192, use 'dark', otherwise use 'light'
	return yiq >= 192 ? 'dark' : 'light'
}

/**
 * Converts a HEX color string to an RGB object.
 * @param hex - The HEX color string (e.g., "#ffffff").
 * @returns An object containing the red (r), green (g), and blue (b) components, and black if the HEX string is invalid.
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
	// Extract the RGB components from the HEX string using a regular expression
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	// If the HEX string is valid, parse the components and return the RGB object
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: { r: 0, g: 0, b: 0 } // Return black if the HEX string is invalid
}
