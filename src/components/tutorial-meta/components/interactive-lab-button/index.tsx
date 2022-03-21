interface InteractiveLabButtonProps {
  showButton: boolean
}

export default function InteractiveLabButton({
  showButton,
}: InteractiveLabButtonProps) {
  if (!showButton) {
    return null
  }
  return <button>Show Terminal</button>
}
