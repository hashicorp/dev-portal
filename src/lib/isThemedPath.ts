export default function isThemedPath(currentPath: string): boolean {
	return !__config.dev_dot.non_themed_paths.includes(currentPath)
}
