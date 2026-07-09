import { useReveal } from '../hooks/useReveal'
import { ExternalIcon } from './Icons'

const DUMMY = '/assets/blog/dummy.png'

function fmt(d) {
  try {
    return new Date(d).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return d
  }
}

export default function Blog({ blog = [] }) {
  const ref = useReveal()

  return (
    <section className="section" id="blog">
      <div className="container reveal" ref={ref}>
        <p className="section-tag">Blog</p>
        <h2 className="section-title">
          Latest <span className="gradient-text">articles</span>
        </h2>

        <div className="blog-grid">
          {blog.map((post, i) => (
            <article className="blog-card" key={i}>
              <a
                className="blog-thumb"
                href={post.url}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={post.image || DUMMY}
                  alt={post.title}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = DUMMY
                  }}
                />
                {post.tag ? <span className="blog-tag">{post.tag}</span> : null}
              </a>
              <div className="blog-body">
                <div className="blog-meta">
                  {fmt(post.date)}
                  {post.readTime ? ` · ${post.readTime}` : ''}
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <a
                  className="blog-read"
                  href={post.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read more <ExternalIcon />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
