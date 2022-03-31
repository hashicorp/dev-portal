function VideoEmbed({ url }) {
  return (
    <pre
      style={{
        border: '1px solid magenta',
        background: `rgba(255,0,255, 0.2)`,
      }}
    >
      <code>{JSON.stringify({ videoEmbed: { url } }, null, 2)}</code>
    </pre>
  )
}

export default VideoEmbed
