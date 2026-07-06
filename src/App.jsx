import { useEffect, useState } from 'react'
import './App.css'
import { ADMIN_PATH } from './config'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Admin from './components/Admin'

export default function App() {
  const [isAdmin, setIsAdmin] = useState(
    () => window.location.hash === ADMIN_PATH
  )

  useEffect(() => {
    const onHashChange = () =>
      setIsAdmin(window.location.hash === ADMIN_PATH)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (isAdmin) return <Admin />

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
