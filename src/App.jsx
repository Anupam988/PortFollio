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

const PAGES = ['about', 'services', 'skills', 'experience', 'projects', 'blog', 'contact']

// Clean path routing (no hash). Needs SPA fallback on static hosts.
function parseRoute() {
  const path = window.location.pathname.replace(/\/+$/, '')
  if (path === ADMIN_PATH) return 'admin'
  const seg = path.split('/').filter(Boolean)
  if (seg.length === 0) return 'home'
  if (seg[0] === 'projects' && seg[1]) return `project:${seg[1]}`
  if (PAGES.includes(seg[0])) return seg[0]
  return 'home'
}

export default function App() {
  const [route, setRoute] = useState(parseRoute)
  const { data, error } = useSiteData()

  // Path routing: intercept internal link clicks + handle back/forward.
  useEffect(() => {
    const onPop = () => setRoute(parseRoute())
    window.addEventListener('popstate', onPop)

    const onClick = (e) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return
      const a = e.target.closest && e.target.closest('a')
      if (!a) return
      const href = a.getAttribute('href')
      if (!href || a.target === '_blank') return
      if (/^(https?:|mailto:|tel:)/i.test(href)) return
      if (href.startsWith('#')) return // in-page anchor
      if (href.startsWith('/')) {
        e.preventDefault()
        if (href !== window.location.pathname) {
          window.history.pushState({}, '', href)
          setRoute(parseRoute())
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    }
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('popstate', onPop)
      document.removeEventListener('click', onClick)
    }
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

  // Jump to top on every route change.
  useEffect(() => {
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
  if (route === 'about') {
    content = (
      <div className="subpage">
        <About about={data.about} />
      </div>
    )
  } else if (route === 'services') {
    content = (
      <div className="subpage">
        <Services page />
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
  } else if (route === 'blog') {
    content = (
      <div className="subpage">
        <Blog blog={data.blog} />
      </div>
    )
  } else if (route === 'contact') {
    content = (
      <div className="subpage">
        <Contact contact={data.contact} />
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
      <Navbar personal={data.personal} route={route} />
      <main>
        <Suspense fallback={<div className="lazy-route-loader" />}>{content}</Suspense>
      </main>
      <Footer personal={data.personal} contact={data.contact} />
      <ScrollTop />
    </>
  )
}
