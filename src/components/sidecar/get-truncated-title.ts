const MAX_CHARACTERS = 26

function getTruncatedTitle(fullTitle: string): string {
  let truncatedTitle: string

  if (fullTitle.length < MAX_CHARACTERS) {
    truncatedTitle = fullTitle
  } else {
    let characterCount = 0
    const words = fullTitle.split(' ')
    const wordsToInclude = []
    words.forEach((word, idx) => {
      const wordLength = word.length
      if (characterCount + wordLength < MAX_CHARACTERS) {
        wordsToInclude.push(word)
        characterCount += wordLength
        // count spaces as well, since these are counted
        // in the fullTitle.length comparison
        if (idx !== words.length) characterCount++
      }
    })
    truncatedTitle = wordsToInclude.join(' ') + `…`
  }
  return truncatedTitle
}

export default getTruncatedTitle
