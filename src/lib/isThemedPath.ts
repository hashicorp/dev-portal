/**
 * Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

export default function isThemedPath(currentPath: string): boolean {
	return !__config.dev_dot.non_themed_paths.includes(currentPath)
}
