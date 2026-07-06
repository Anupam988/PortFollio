import { useReveal } from '../hooks/useReveal'
import { skills } from '../data/content'

export default function Skills() {
  const ref = useReveal()

  return (
    <section className="section" id="skills">
      <div className="container reveal" ref={ref}>
        <p className="section-tag">Skills</p>
        <h2 className="section-title">
          Tools I <span className="gradient-text">work with</span>
        </h2>

        <div className="skills-grid">
          {skills.map((group) => (
            <div className="skill-card" key={group.title}>
              <h3>
                <span className="dot" />
                {group.title}
              </h3>
              <div className="skill-tags">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
