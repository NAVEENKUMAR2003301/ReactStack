const FEATURES = [
  { icon: '📚', title: '20 In-Depth Lessons', text: 'From the first component to advanced patterns.' },
  { icon: '🎛️', title: '20+ Interactive Demos', text: 'Live, editable examples for every core hook and concept.' },
  { icon: '✅', title: 'Practice Quizzes', text: 'Check understanding with end-of-lesson questions.' },
  { icon: '⚡', title: 'Modern Codebase', text: 'React + Vite, plain CSS design tokens, and Framer Motion.' },
  { icon: '🧩', title: 'Runnable Examples', text: 'Modify and run React code directly in the browser.' },
  { icon: '🌗', title: 'Light & Dark Themes', text: 'A polished reading experience, day or night.' },
];

export default function WhatsInside() {
  return (
    <section className="home-section">
      <div className="section-heading">
        <h2>What&rsquo;s Inside</h2>
        <p className="section-sub">Everything you need to actually understand React, not just copy it.</p>
      </div>
      <div className="feature-grid">
        {FEATURES.map((f) => (
          <div key={f.title} className="feature-card">
            <span className="feature-card__icon" aria-hidden="true">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
