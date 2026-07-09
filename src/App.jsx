import { useEffect, useState } from 'react'
import './App.css'
import { ADMIN_PATH } from './config'
import { useSiteData } from './data/siteDataContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Admin from './components/Admin'
import ScrollTop from './components/ScrollTop'
import Decorations from './components/Decorations'
import SocialSidebar from './components/SocialSidebar'

const PAGES = ['blog', 'skills', 'experience', 'projects']

function parseRoute() {
  const h = window.location.hash
  if (h === ADMIN_PATH) return 'admin'
  if (h.startsWith('#/')) {
    const p = h.slice(2).split(/[?#/]/)[0]
    if (PAGES.includes(p)) return p
  }
  return 'home'
}

export default function App() {
  const [route, setRoute] = useState(parseRoute)
  const { data, error } = useSiteData()

  useEffect(() => {
    const onHash = () => setRoute(parseRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Scroll behaviour when the route changes.
  useEffect(() => {
    if (route === 'home') {
      const h = window.location.hash
      if (h && h.length > 1 && !h.startsWith('#/')) {
        const el = document.querySelector(h)
        if (el) {
          requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth' }))
          return
        }
      }
    }
    window.scrollTo(0, 0)
  }, [route])

  if (route === 'admin') return <Admin />

  if (error) {
    return (
      <div className="app-state">
        <p className="glyph">{'{ ! }'}</p>
        <h2>Couldn&apos;t load site data</h2>
        <p>
          Check that the JSON files in <code>public/data</code> are valid.
        </p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="app-state">
        <span className="loader" />
        <p>Loading…</p>
      </div>
    )
  }

  let content
  if (route === 'blog') {
    content = (
      <div className="subpage">
        <Blog blog={data.blog} />
      </div>
    )
  } else if (route === 'skills') {
    content = (
      <div className="subpage">
        <Skills skills={data.skills} detailed />
      </div>
    )
  } else if (route === 'experience') {
    content = (
      <div className="subpage">
        <Experience
          experience={data.experience}
          technologies={data.technologies}
          skills={data.skills}
        />
      </div>
    )
  } else if (route === 'projects') {
    content = (
      <div className="subpage">
        <Projects projects={data.projects} />
      </div>
    )
  } else {
    content = (
      <>
        <Hero
          personal={data.personal}
          technologies={data.technologies}
          about={data.about}
        />
        <About about={data.about} />
        <Skills skills={data.skills} />
        <Experience
          experience={data.experience}
          technologies={data.technologies}
          skills={data.skills}
          variant="compact"
        />
        <Projects projects={data.projects} />
        <Contact contact={data.contact} />
      </>
    )
  }

  return (
    <>
      <Decorations />
      <SocialSidebar items={data.contact?.items || []} />
      <Navbar personal={data.personal} />
      <main>{content}</main>
      <Footer personal={data.personal} />
      <ScrollTop />
    </>
  )
}
