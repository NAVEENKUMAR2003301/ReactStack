import { Link } from 'react-router-dom';

export default function PurchaseCTA() {
  return (
    <section className="home-section">
      <div className="purchase-cta">
        <h2>License the Complete React Course Source Code</h2>
        <p>
          One-time purchase, lifetime use. Includes all 20 lessons, demos, quizzes, and the
          full codebase.
        </p>
        <div className="btn-row">
          <a
            href="mailto:vishnuvardhand015@gmail.com?subject=React%20Atlas%20course%20license"
            className="btn btn--primary"
          >
            Get the Source Code →
          </a>
          <Link to="/learn/state" className="btn">
            Preview the Course
          </Link>
        </div>
      </div>
    </section>
  );
}
