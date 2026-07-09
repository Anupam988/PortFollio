import { useEffect, useState } from 'react'
import { SiteDataContext } from './siteDataContext'

// ============================================================
//  Loads all site content from editable JSON files in /public/data.
//  Edit those files any time — no rebuild needed, just refresh.
// ============================================================

const FILES = {
  personal: '/data/personal.json',
  about: '/data/about.json',
  skills: '/data/skills.json',
  projects: '/data/projects.json',
  experience: '/data/experience.json',
  blog: '/data/blog.json',
  contact: '/data/contact.json',
  technologies: '/data/technologies.json',
}

export function SiteDataProvider({ children }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true

    Promise.all(
      Object.entries(FILES).map(([key, url]) =>
        fetch(url).then((res) => {
          if (!res.ok) throw new Error(`Failed to load ${url}`)
          return res.json().then((json) => [key, json])
        })
      )
    )
      .then((entries) => {
        if (alive) setData(Object.fromEntries(entries))
      })
      .catch((err) => {
        console.error('[SiteData]', err.message)
        if (alive) setError(true)
      })

    return () => {
      alive = false
    }
  }, [])

  return (
    <SiteDataContext.Provider value={{ data, error }}>
      {children}
    </SiteDataContext.Provider>
  )
}
