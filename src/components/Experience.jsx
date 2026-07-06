import { useReveal } from '../hooks/useReveal'
import { ExternalIcon } from './Icons'

function initials(name = '') {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function ExperienceItem({ exp, side }) {
  const ref = useReveal()

  return (
    <div className={`timeline-item ${side}`} ref={ref}>
      <span className="timeline-dot" />
      <div className="exp-card">
        <div className="exp-head">
          <div className="exp-logo">
            {exp.logo ? (
              <img src={exp.logo} alt={exp.company} />
            ) : (
              <span className="exp-logo-fallback" title={exp.company}>
                <i className="fa-solid fa-building" />
                <span className="exp-logo-initials">{initials(exp.company)}</span>
              </span>
            )}
          </div>
          <div className="exp-headinfo">
            <h3 className="exp-role">{exp.role}</h3>
            {exp.companyUrl ? (
              <a
                className="exp-company"
                href={exp.companyUrl}
                target="_blank"
                rel="noreferrer"
              >
                {exp.company} <ExternalIcon />
              </a>
            ) : (
              <span className="exp-company">{exp.company}</span>
            )}
          </div>
          <span className="exp-period">{exp.period}</span>
        </div>

        {exp.location ? <p className="exp-location">{exp.location}</p> : null}

        <ul className="exp-points">
          {(exp.points || []).map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>

        {exp.technologies && exp.technologies.length ? (
          <div className="exp-tech">
            {exp.technologies.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default function Experience({ experience = [] }) {
  return (
    <section className="section" id="experience">
      <div className="container">
        <p className="section-tag">Experience</p>
        <h2 className="section-title">
          Where I&apos;ve <span className="gradient-text">worked</span>
        </h2>

        <div className="timeline">
          {experience.map((exp, i) => (
            <ExperienceItem
              key={(exp.company || '') + i}
              exp={exp}
              side={i % 2 === 0 ? 'left' : 'right'}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
