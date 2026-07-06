import { useReveal } from '../hooks/useReveal'
import { projects } from '../data/content'
import { ExternalIcon, CodeIcon } from './Icons'

export default function Projects() {
  const ref = useReveal()

  return (
    <section className="section" id="projects">
      <div className="container reveal" ref={ref}>
        <p className="section-tag">Work</p>
        <h2 className="section-title">
          Featured <span className="gradient-text">projects</span>
        </h2>

        <div className="projects-grid">
          {projects.map((p) => (
            <article className="project-card" key={p.title}>
              <div className="project-thumb">
                <span className="glyph">{p.glyph}</span>
              </div>
              <div className="project-body">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="project-stack">
                  {p.stack.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a href={p.demo} target="_blank" rel="noreferrer">
                    <ExternalIcon /> Live demo
                  </a>
                  <a href={p.repo} target="_blank" rel="noreferrer">
                    <CodeIcon /> Source
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
