import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { ExternalIcon, EyeIcon } from './Icons'
import { techInfo } from '../data/techIcons'

function getTech(project) {
  return project.tech || project.stack || []
}

function prettyUrl(url) {
  return url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : ''
}

/* ---------- Detail page: big image + write-up left, compact sticky info right ---------- */
function ProjectDetail({ project }) {
  const [showTech, setShowTech] = useState(false)

  if (!project) {
    return (
      <section className="section project-detail">
        <div className="container pd-container">
          <p className="section-tag">Project</p>
          <h2 className="section-title">Project not found</h2>
          <a className="btn btn-primary" href="#/projects">
            Back to projects
          </a>
        </div>
      </section>
    )
  }

  const tech = getTech(project)
  const features = project.features || []
  const responsibilities = project.responsibilities || []
  const blocks = [
    ['Overview', project.overview],
    ['The problem', project.problem],
    ['The solution', project.solution],
    ['Impact', project.impact],
  ].filter(([, v]) => v)

  return (
    <section className="section project-detail">
      <div className="pd-bg-wrap" aria-hidden="true">
        {project.image ? (
          <div
            className="pd-bg"
            style={{ backgroundImage: `url(${project.image})` }}
          />
        ) : null}
        <div className="pd-bg-overlay" />
      </div>

      <div className="container pd-container">
        <a className="project-back" href="#/projects">
          &larr; All projects
        </a>

        <div className="pd-split">
          <div className="pd-main-col">
            {project.image ? (
              <div className="pd-preview">
                <div className="pd-browser-bar">
                  <span className="pd-dot r" />
                  <span className="pd-dot y" />
                  <span className="pd-dot g" />
                  {project.demo ? (
                    <span className="pd-url">{prettyUrl(project.demo)}</span>
                  ) : null}
                </div>
                <img src={project.image} alt={project.title} decoding="async" />
              </div>
            ) : null}

            <div className="pd-write">
              <span className="pd-category">{project.category || 'Project'}</span>
              <h1 className="pd-title gradient-text">{project.title}</h1>
              {project.description ? (
                <p className="pd-lead">{project.description}</p>
              ) : null}

              {project.desc ? (
                <div
                  className="pd-desc"
                  dangerouslySetInnerHTML={{ __html: project.desc }}
                />
              ) : (
                <>
                  {blocks.map(([label, val]) => (
                    <div className="pd-block" key={label}>
                      <h4>{label}</h4>
                      <p>{val}</p>
                    </div>
                  ))}

                  {features.length ? (
                    <div className="pd-block">
                      <h4>Key features</h4>
                      <ul className="pd-features">
                        {features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {responsibilities.length ? (
                    <div className="pd-block">
                      <h4>My responsibilities</h4>
                      <ul className="pd-check">
                        {responsibilities.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>

          <aside className="pd-side-col">
            <div className="pd-side-card">
              {project.role ? (
                <div className="pd-meta">
                  <span>Role</span>
                  <strong>{project.role}</strong>
                </div>
              ) : null}
              <div className="pd-meta">
                <span>Client</span>
                <strong>{project.client || project.title}</strong>
              </div>
              <div className="pd-meta">
                <span>Status</span>
                <strong className="pd-status">{project.status || 'Completed'}</strong>
              </div>
              <div className="pd-meta">
                <span>Category</span>
                <strong>{project.category || 'Project'}</strong>
              </div>
            </div>

            {tech.length ? (
              <div className="pd-side-card pd-tech-card">
                <span className="pd-side-cap">Tech stack</span>
                <div className="pd-tech-row">
                  {tech.slice(0, 4).map((t) => {
                    const info = techInfo(t)
                    return (
                      <span className="pd-ic" key={t} title={t}>
                        <i
                          className={info.icon}
                          style={{ color: info.color }}
                          aria-hidden="true"
                        />
                      </span>
                    )
                  })}
                  {tech.length > 4 ? (
                    <button
                      type="button"
                      className="pd-ic pd-tech-more"
                      onClick={() => setShowTech((v) => !v)}
                      aria-expanded={showTech}
                      aria-label="Show all technologies"
                    >
                      +{tech.length - 4}
                    </button>
                  ) : null}

                  {showTech ? (
                    <div className="pd-tech-pop">
                      {tech.map((t) => {
                        const info = techInfo(t)
                        return (
                          <span key={t}>
                            <i
                              className={info.icon}
                              style={{ color: info.color }}
                              aria-hidden="true"
                            />
                            {t}
                          </span>
                        )
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {project.demo ? (
              <a
                className="btn btn-primary pd-visit"
                href={project.demo}
                target="_blank"
                rel="noreferrer"
              >
                Visit live site <ExternalIcon />
              </a>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  )
}

/* ---------- Project tile: image + hover overlay with two actions ---------- */
function ProjectTile({ project }) {
  const ref = useReveal()
  const tech = getTech(project)
  const detailHref = project.slug ? `#/projects/${project.slug}` : undefined

  return (
    <article className="project-tile reveal" ref={ref}>
      <div className="pr-browser">
        <span className="r" />
        <span className="y" />
        <span className="g" />
        {project.demo ? <span className="u">{prettyUrl(project.demo)}</span> : null}
      </div>
      <div className="pr-shot">
        {project.image ? (
          <img src={project.image} alt={project.title} loading="lazy" decoding="async" />
        ) : (
          <span className="glyph">{project.glyph}</span>
        )}
        <div className="pr-hover">
          {project.category ? <span className="pt-cat">{project.category}</span> : null}
          <span className="pt-title">{project.title}</span>
          <div className="pr-hover-tech">
            {tech.slice(0, 6).map((t) => {
              const info = techInfo(t)
              return (
                <i
                  key={t}
                  className={info.icon}
                  style={{ color: info.color }}
                  title={t}
                  aria-hidden="true"
                />
              )
            })}
          </div>
          <div className="pr-hover-actions">
            {detailHref ? (
              <a className="pr-btn pr-btn-primary" href={detailHref}>
                <EyeIcon /> View details
              </a>
            ) : null}
            {project.demo ? (
              <a
                className="pr-btn pr-btn-ghost"
                href={project.demo}
                target="_blank"
                rel="noreferrer"
              >
                Visit <ExternalIcon />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}

/* ---------- All projects: left filter bar + right tile grid ---------- */
function ProjectsBrowser({ projects }) {
  const [filter, setFilter] = useState('All')

  const sorted = [...projects].sort(
    (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
  )
  const categories = [
    'All',
    ...Array.from(new Set(sorted.map((p) => p.category).filter(Boolean))),
  ]
  const countFor = (c) =>
    c === 'All' ? sorted.length : sorted.filter((p) => p.category === c).length
  const filtered =
    filter === 'All' ? sorted : sorted.filter((p) => p.category === filter)

  return (
    <section className="section" id="projects">
      <div className="container">
        <p className="section-tag">Work</p>
        <h2 className="section-title">
          All <span className="gradient-text">projects</span>
        </h2>

        <div className="proj-browser">
          <aside className="proj-filters">
            <h4>Categories</h4>
            <ul>
              {categories.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    className={c === filter ? 'active' : undefined}
                    onClick={() => setFilter(c)}
                  >
                    <span>{c}</span>
                    <span className="count">{countFor(c)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="proj-grid">
            {filtered.map((p) => (
              <ProjectTile project={p} key={p.slug || p.title} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Projects({ projects, activeProject, showProject, detailed }) {
  const ref = useReveal()

  if (showProject) {
    return <ProjectDetail project={activeProject} />
  }

  if (detailed) {
    return <ProjectsBrowser projects={projects} />
  }

  const featured = projects.filter((p) => p.featured).slice(0, 6)
  const remaining = projects.length - featured.length

  return (
    <section className="section" id="projects">
      <div className="container reveal" ref={ref}>
        <p className="section-tag">Work</p>
        <h2 className="section-title">
          Featured <span className="gradient-text">projects</span>
        </h2>

        <div className="projects-tiles">
          {featured.map((p) => (
            <ProjectTile project={p} key={p.slug || p.title} />
          ))}
        </div>

        {remaining > 0 ? (
          <div className="projects-more">
            <a className="btn btn-ghost" href="#/projects">
              +{remaining} more {remaining === 1 ? 'project' : 'projects'}
            </a>
          </div>
        ) : null}
      </div>
    </section>
  )
}
