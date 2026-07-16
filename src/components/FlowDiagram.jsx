import { motion } from 'framer-motion';

export default function FlowDiagram({ steps, activeIndex = -1 }) {
  return (
    <div className="flow" role="list" aria-label="Flow diagram">
      {steps.map((step, i) => (
        <div key={step.label} style={{ display: 'contents' }}>
          <motion.div
            role="listitem"
            className={`flow__step${i === activeIndex ? ' is-active' : ''}`}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
          >
            <span className="flow__step-icon" aria-hidden="true">{step.icon}</span>
            <span>{step.label}</span>
          </motion.div>
          {i < steps.length - 1 && (
            <span className="flow__arrow" aria-hidden="true">→</span>
          )}
        </div>
      ))}
    </div>
  );
}
