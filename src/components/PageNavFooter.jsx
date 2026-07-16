import { Link } from 'react-router-dom';
import { getAdjacentTopics } from '../data/topics';

export default function PageNavFooter({ slug }) {
  const { prev, next } = getAdjacentTopics(slug);
  return (
    <nav className="page-nav-footer" aria-label="Topic navigation">
      {prev ? (
        <Link to={`/learn/${prev.slug}`}>
          <span className="dir">← Previous</span>
          {prev.icon} {prev.title}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link to={`/learn/${next.slug}`} className="next">
          <span className="dir">Next →</span>
          {next.icon} {next.title}
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
