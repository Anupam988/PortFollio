import { useReveal } from '../hooks/useReveal'
import AboutImage from './AboutImage'

export default function About({ about }) {
  const ref = useReveal()

  return (
    <section className="section" id="about">
      <div className="container reveal" ref={ref}>
        <p className="section-tag">About</p>
        <h2 className="section-title">
          A bit <span className="gradient-text">about me</span>
        </h2>

        <div className="about-grid">
          <div className="about-text">
            <p className="about-lead">{about.lead}</p>
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            <div className="about-code">
              <span className="k">const</span> developer = {'{'}
              <br />
              &nbsp;&nbsp;<span className="p">available</span>:{' '}
              <span className="k">true</span>,
              <br />
              &nbsp;&nbsp;<span className="p">stack</span>:{' '}
              <span className="s">'MERN + TypeScript'</span>,
              <br />
              &nbsp;&nbsp;<span className="p">loves</span>:{' '}
              <span className="s">'clean code &amp; great UX'</span>,
              <br />
              {'}'}
            </div>
          </div>

          <AboutImage src={about.image} alt={about.imageAlt} />
        </div>
      </div>
    </section>
  )
}
