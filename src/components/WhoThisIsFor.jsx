const AUDIENCES = [
  { icon: '🧑‍💻', title: 'Self-Learners', text: "Move from following tutorials to truly understanding React's execution model." },
  { icon: '🏫', title: 'Coding Bootcamps', text: "A ready-to-use curriculum that explains the 'why' behind every React pattern." },
  { icon: '🎓', title: 'Course Creators', text: 'License and rebrand this complete, interactive React course for your own platform.' },
  { icon: '💼', title: 'Working Developers', text: 'Fill in the gaps on hooks, context, and performance you never got around to.' },
];

export default function WhoThisIsFor() {
  return (
    <section className="home-section">
      <div className="section-heading">
        <h2>Who This Is For</h2>
      </div>
      <div className="audience-grid">
        {AUDIENCES.map((a) => (
          <div key={a.title} className="audience-card">
            <span className="audience-card__icon" aria-hidden="true">{a.icon}</span>
            <h3>{a.title}</h3>
            <p>{a.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
