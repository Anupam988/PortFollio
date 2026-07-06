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
import Contact from './components/Contact'
import Footer from './components/Footer'
import Admin from './components/Admin'
import ScrollTop from './components/ScrollTop'

export default function App() {
  const [isAdmin, setIsAdmin] = useState(
    () => window.location.hash === ADMIN_PATH
  )
  const { data, error } = useSiteData()

  useEffect(() => {
    const onHashChange = () =>
      setIsAdmin(window.location.hash === ADMIN_PATH)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (isAdmin) return <Admin />

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

  return (
    <>
      <Navbar personal={data.personal} />
      <main>
        <Hero
          personal={data.personal}
          technologies={data.technologies}
          about={data.about}
        />
        <About about={data.about} />
        <Skills skills={data.skills} />
        <Experience experience={data.experience} />
        <Projects projects={data.projects} />
        <Contact personal={data.personal} />
      </main>
      <Footer personal={data.personal} />
      <ScrollTop />
    </>
  )
}
