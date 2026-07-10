import { Suspense, lazy, useEffect, useState } from 'react'
import './App.css'
import { ADMIN_PATH } from './config'
import { useSiteData } from './data/siteDataContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import LazySection from './components/LazySection'
import Footer from './components/Footer'
import Admin from './components/Admin'
import ScrollTop from './components/ScrollTop'
import Decorations from './components/Decorations'
import SocialSidebar from './components/SocialSidebar'

const Services = lazy(() => import('./components/Services'))
const About = lazy(() => import('./components/About'))
const Skills = lazy(() => import('./components/Skills'))
const Experience = lazy(() => import('./components/Experience'))
const Projects = lazy(() => import('./components/Projects'))
const Blog = lazy(() => import('./components/Blog'))
const Contact = lazy(() => import('./components/Contact'))

const PAGES = ['blog', 'skills', 'experience', 'projects']

function parseRoute() {
  const h = window.location.hash
  if (h === ADMIN_PATH) return 'admin'
  if (h.startsWith('#/')) {
    const parts = h.slice(2).split(/[?#]/)[0].split('/').filter(Boolean)
    const p = parts[0]
    if (p === 'projects' && parts[1]) return `project:${parts[1]}`
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

  useEffect(() => {
    if (!data) return

    const name = data.personal?.name || 'Anupam Chakraborty'
    const roles = data.personal?.roles || []
    const projects = data.projects?.map((p) => p.title).filter(Boolean) || []
    const title = `${name} - ${roles[1] || roles[0] || 'Full-Stack Developer'}`
    const description =
      data.personal?.tagline ||
      `${name} portfolio, services, skills, projects, and contact.`
    const keywords = [
      name,
      ...roles,
      'web development',
      'system architecture',
      'database schema design',
      'frontend development',
      'backend development',
      'cloud computing',
      'Laravel',
      'MySQL',
      ...projects,
    ]
      .filter(Boolean)
      .join(', ')

    document.title = title

    const setMeta = (selector, key, value) => {
      let tag = document.head.querySelector(selector)
      if (!tag) {
        tag = document.createElement('meta')
        const match = selector.match(/\[(name|property)="([^"]+)"\]/)
        if (match) tag.setAttribute(match[1], match[2])
        document.head.appendChild(tag)
      }
      tag.setAttribute(key, value)
    }

    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[name="keywords"]', 'content', keywords)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:image"]', 'content', '/assets/web/logo.png')
  }, [data])

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
        <Projects projects={data.projects} detailed />
      </div>
    )
  } else if (route.startsWith('project:')) {
    const slug = route.slice('project:'.length)
    const project = data.projects.find((p) => p.slug === slug)
    content = (
      <div className="subpage">
        <Projects
          projects={data.projects}
          activeProject={project}
          showProject
          detailed
        />
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
        <LazySection id="services" minHeight={360}>
          <Services />
        </LazySection>
        <LazySection id="about" minHeight={720}>
          <About about={data.about} />
        </LazySection>
        <LazySection id="skills" minHeight={560}>
          <Skills skills={data.skills} />
        </LazySection>
        <LazySection id="experience" minHeight={560}>
          <Experience
            experience={data.experience}
            technologies={data.technologies}
            skills={data.skills}
            variant="compact"
          />
        </LazySection>
        <LazySection id="projects" minHeight={520}>
          <Projects projects={data.projects} />
        </LazySection>
        <LazySection id="contact" minHeight={620}>
          <Contact contact={data.contact} />
        </LazySection>
      </>
    )
  }

  return (
    <>
      <Decorations />
      <SocialSidebar items={data.contact?.items || []} />
      <Navbar personal={data.personal} />
      <main>
        <Suspense fallback={<div className="lazy-route-loader" />}>
          {content}
        </Suspense>
      </main>
      <Footer personal={data.personal} contact={data.contact} />
      <ScrollTop />
    </>
  )
}
