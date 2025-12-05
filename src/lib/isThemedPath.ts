/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

export default function isThemedPath(currentPath: string): boolean {
	return !__config.dev_dot.non_themed_paths.includes(currentPath)
}
