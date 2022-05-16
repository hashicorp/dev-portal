import {
  cleanup,
  //   fireEvent,
  render,
  //   screen,
  //   waitFor,
} from '@testing-library/react'
import VideoEmbed from '../'

afterEach(cleanup)

it('should render a root element with a `playerWrapper` class', () => {
  const { container } = render(
    <VideoEmbed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
  )
  expect(container.firstChild).toHaveClass('playerWrapper')
})

// Analytics via Heap (drop in favour of Segment?)
it.todo('should fire a Heap "Video Started" event when the video starts')
it.todo('should fire a Heap "Video Ended" event when the video ends')

// Analytics via Segment
// https://github.com/hashicorp/dev-portal/blob/main/analytics/spec/events/video_played.yaml
it.todo('should track a 1% "Video Played" event, on start')
// Combine below? Would using a short 1-second video make sense?
it.todo('should track a 25% "Video Played" event')
it.todo('should track a 50% "Video Played" event')
it.todo('should track a 75% "Video Played" event')
it.todo('should track a 90% "Video Played" event')

//   it('should track a "Copy" event when the "Copy" button is clicked', async () => {
//     // Setup - mock window.analytics
//     const forMockRestore = window.analytics
//     window.analytics = { track: jest.fn() }
//     // Tests
//     render(
//       <VideoEmbed
//         code={`console.log("Hello world");`}
//         options={{ showClipboard: true }}
//       />
//     )
//     // Find and click the copy button
//     const buttonElem = screen.getByText('Copy')
//     expect(buttonElem.tagName).toBe('BUTTON')
//     expect(buttonElem).toBeInTheDocument()
//     fireEvent.click(buttonElem)
//     //  Expect window.analytics.track to have been called
//     await waitFor(() => expect(window.analytics.track).toHaveBeenCalledTimes(1))
//     expect(window.analytics.track).toBeCalledWith('Copy', {
//       category: 'CodeBlock',
//     })
//     // Cleanup
//     window.analytics = forMockRestore
//   })
