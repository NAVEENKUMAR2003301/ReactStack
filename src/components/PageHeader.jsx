import { motion } from 'framer-motion';
import { LEVELS } from '../data/topics';

export default function PageHeader({ topic, children }) {
  const level = LEVELS[topic.level];
  return (
    <motion.header
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <span className={`page-kicker`}>
        <span aria-hidden="true">{topic.icon}</span> {topic.title}
      </span>
      <div style={{ marginBottom: 8 }}>
        <span className={`badge ${level.badge}`}>{level.label}</span>
      </div>
      <h1>{topic.title}</h1>
      <p className="page-lede">{children}</p>
    </motion.header>
  );
}
