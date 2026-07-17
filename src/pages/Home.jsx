import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LEVELS, TOPICS } from '../data/topics';
import CurriculumHighlights from '../components/CurriculumHighlights';
import WhatsInside from '../components/WhatsInside';
import WhoThisIsFor from '../components/WhoThisIsFor';
import PurchaseCTA from '../components/PurchaseCTA';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Home() {
  return (
    <div>
      <section className="hero">
        <motion.span
          className="hero__eyebrow"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          ⚛ 20 topics · live demos · zero setup
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          Learn React by seeing it think.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Every concept from your first component to advanced hooks, explained in plain
          language, paired with an interactive demo you can poke at, and a quiz to check
          it actually stuck.
        </motion.p>
        <motion.div
          className="btn-row"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Link to="/learn/jsx" className="btn btn--primary">
            Start with JSX →
          </Link>
          <Link to="/learn/state" className="btn">
            ▶ Try a Free Lesson
          </Link>
          <Link to="/learn/use-reducer" className="btn">
            Jump to advanced
          </Link>
        </motion.div>

        <div className="stat-row">
          <div className="stat">
            <b>20</b>
            <span>topics</span>
          </div>
          <div className="stat">
            <b>3</b>
            <span>skill levels</span>
          </div>
          <div className="stat">
            <b>20+</b>
            <span>live demos</span>
          </div>
        </div>
      </section>

      <CurriculumHighlights />
      <WhatsInside />
      <WhoThisIsFor />

      {Object.entries(LEVELS).map(([levelKey, level]) => (
        <section key={levelKey} style={{ marginBottom: 'var(--space-7)' }}>
          <div className="section-heading">
            <h2 style={{ marginTop: 0 }}>
              <span className={`badge ${level.badge}`} style={{ marginRight: 10 }}>
                {level.label}
              </span>
            </h2>
          </div>
          <motion.div
            className="topic-grid"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {TOPICS.filter((t) => t.level === levelKey).map((topic) => (
              <motion.div key={topic.slug} variants={item}>
                <Link to={`/learn/${topic.slug}`} className="topic-card">
                  <div className="topic-card__top">
                    <span className="topic-card__icon" aria-hidden="true">
                      {topic.icon}
                    </span>
                  </div>
                  <h3>{topic.title}</h3>
                  <p>{topic.summary}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
      ))}

      <PurchaseCTA />
    </div>
  );
}
