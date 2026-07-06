import { useEffect, useState } from 'react'

/**
 * Cycles through `words`, typing and deleting each one.
 * Returns the current partial string to render.
 */
export function useTypewriter(words, { type = 90, del = 45, hold = 1400 } = {}) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[index % words.length]

    if (!deleting && text === word) {
      const t = setTimeout(() => setDeleting(true), hold)
      return () => clearTimeout(t)
    }

    if (deleting && text === '') {
      setDeleting(false)
      setIndex((i) => (i + 1) % words.length)
      return
    }

    const delay = deleting ? del : type
    const t = setTimeout(() => {
      setText((prev) =>
        deleting ? word.slice(0, prev.length - 1) : word.slice(0, prev.length + 1)
      )
    }, delay)

    return () => clearTimeout(t)
  }, [text, deleting, index, words, type, del, hold])

  return text
}
