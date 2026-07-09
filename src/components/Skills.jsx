import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'

function normalize(it) {
  return {
    name: typeof it === 'string' ? it : it.name,
    icon: (typeof it === 'object' && it.icon) || 'fa-solid fa-code',
    color: typeof it === 'object' ? it.color : null,
  }
}

export default function Skills({ skills = [] }) {
  const ref = useReveal()
  const [active, setActive] = useState(0)

  // Tabs: All + each category from the JSON.
  const tabs = [
    { title: 'All', items: skills.flatMap((g) => g.items || []) },
    ...skills,
  ]
  const items = (tabs[active]?.items || []).map(normalize)

  return (
    <section className="section" id="skills">
      <div className="container reveal" ref={ref}>
        <p className="section-tag">Skills</p>
        <h2 className="section-title">
          Tools I <span className="gradient-text">work with</span>
        </h2>

        <div className="skills-tabbar" role="tablist">
          {tabs.map((t, i) => (
            <button
              type="button"
              key={t.title}
              className={i === active ? 'active' : ''}
              onClick={() => setActive(i)}
              role="tab"
              aria-selected={i === active}
            >
              {t.title}
              <span className="count">{(t.items || []).length}</span>
            </button>
          ))}
        </div>

        <div className="skills-card">
          <div className="skills-list" key={active}>
            {items.map((it, idx) => (
              <div className="skill-item" key={it.name} style={{ '--i': idx }}>
                <span
                  className="skill-bullet"
                  style={it.color ? { color: it.color } : undefined}
                >
                  <i className={it.icon} aria-hidden="true" />
                </span>
                <span className="skill-item-name">{it.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
