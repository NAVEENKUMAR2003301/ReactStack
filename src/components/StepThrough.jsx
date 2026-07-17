import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * A manual, click-through walkthrough of a single interaction: each step
 * shows what just happened, why it happened, and a preview of state at
 * that point. No timers/autoplay — the reader controls the pace.
 */
export default function StepThrough({ title, steps }) {
  const [index, setIndex] = useState(0);
  const step = steps[index];
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  return (
    <div className="step-through">
      {title && <div className="step-through__title">{title}</div>}

      <div className="step-through__rail" role="list">
        {steps.map((s, i) => (
          <div
            key={s.label}
            role="listitem"
            className={
              'step-through__node' +
              (i === index ? ' is-active' : '') +
              (i < index ? ' is-done' : '')
            }
          >
            <span className="step-through__node-icon" aria-hidden="true">{s.icon}</span>
            <span className="step-through__node-label">{s.label}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="step-through__panel"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          <p className="step-through__explain">
            <strong>
              Step {index + 1} of {steps.length}:
            </strong>{' '}
            {step.explain}
          </p>
          {step.preview && <div className="step-through__preview">{step.preview}</div>}
        </motion.div>
      </AnimatePresence>

      <div className="btn-row">
        <button
          type="button"
          className="btn"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={isFirst}
        >
          ← Back
        </button>
        {isLast ? (
          <button type="button" className="btn" onClick={() => setIndex(0)}>
            ↺ Run again
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
          >
            Next step →
          </button>
        )}
      </div>
    </div>
  );
}
