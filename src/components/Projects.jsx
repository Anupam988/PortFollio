import { useReveal } from '../hooks/useReveal'
import { ExternalIcon, CodeIcon } from './Icons'

function getTech(project) {
  return project.tech || project.stack || []
}

function ProjectDetail({ project }) {
  if (!project) {
    return (
      <section className="section project-detail">
        <div className="container">
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

  return (
    <section className="section project-detail">
      <div className="container">
        <a className="project-back" href="#/projects">
          &larr; All projects
        </a>

        <div className="project-showcase">
          {project.demo ? (
            <iframe
              src={project.demo}
              title={`${project.title} website preview`}
              loading="lazy"
              scrolling="no"
              referrerPolicy="no-referrer-when-downgrade"
              className="project-showcase-frame"
            />
          ) : project.image ? (
            <img src={project.image} alt={project.title} decoding="async" />
          ) : (
            <span className="glyph">{project.glyph}</span>
          )}
          <div className="project-showcase-overlay">
            <p>{project.category || 'Project'}</p>
            <h2>{project.title}</h2>
            {project.demo ? (
              <a href={project.demo} target="_blank" rel="noreferrer">
                Visit site <ExternalIcon />
              </a>
            ) : null}
          </div>
        </div>

        <div className="project-info-panel">
          <aside className="project-info-side">
            <div>
              <span>Role</span>
              <strong>{project.role || 'Full-Stack Developer'}</strong>
            </div>
            {tech.length ? (
              <div>
                <span>Technology</span>
                <strong>{tech.join(', ')}</strong>
              </div>
            ) : null}
            <div>
              <span>Client</span>
              <strong>{project.client || project.title}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{project.status || 'Completed'}</strong>
            </div>
          </aside>

          <div className="project-info-main">
            <p className="section-tag">{project.category || 'Project'}</p>
            <h3>{project.title}</h3>
            <p>
              {[project.overview, project.problem, project.solution, project.impact]
                .filter(Boolean)
                .join(' ')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Projects({
  projects,
  activeProject,
  showProject,
  detailed,
}) {
  const ref = useReveal()

  if (showProject) {
    return <ProjectDetail project={activeProject} />
  }

  const visibleProjects = detailed
    ? [...projects].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    : projects.filter((p) => p.featured)

  return (
    <section className="section" id="projects">
      <div className="container reveal" ref={ref}>
        <p className="section-tag">Work</p>
        <h2 className="section-title">
          {detailed ? 'All ' : 'Featured '}
          <span className="gradient-text">projects</span>
        </h2>

        <div className="projects-grid">
          {visibleProjects.map((p) => (
            <article className="project-card" key={p.title}>
              <div className="project-thumb">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="glyph">{p.glyph}</span>
                )}
              </div>
              <div className="project-body">
                <div>
                  <div className="project-meta">
                    {p.category ? <span>{p.category}</span> : null}
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                </div>
                <div className="project-links">
                  {p.slug ? (
                    <a
                      className="project-detail-arrow"
                      href={`#/projects/${p.slug}`}
                      aria-label={`View ${p.title} details`}
                    >
                      <ExternalIcon />
                    </a>
                  ) : null}
                  {p.demo ? (
                    <a href={p.demo} target="_blank" rel="noreferrer">
                      <ExternalIcon /> Live demo
                    </a>
                  ) : null}
                  {p.repo ? (
                    <a href={p.repo} target="_blank" rel="noreferrer">
                      <CodeIcon /> Source
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
