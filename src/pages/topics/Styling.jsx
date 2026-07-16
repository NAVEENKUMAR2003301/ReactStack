import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavFooter from '../../components/PageNavFooter';
import CodeBlock from '../../components/CodeBlock';
import DemoCard from '../../components/DemoCard';
import Callout from '../../components/Callout';
import Quiz from '../../components/Quiz';
import { TOPICS } from '../../data/topics';

const topic = TOPICS.find((t) => t.slug === 'styling');

function StylingDemo() {
  const [urgent, setUrgent] = useState(false);
  return (
    <>
      <div
        className={`card${urgent ? ' is-urgent' : ''}`}
        style={{
          borderColor: urgent ? 'var(--danger)' : 'var(--border)',
          background: urgent ? 'var(--danger-soft)' : 'var(--bg-elevated)',
          color: urgent ? 'var(--danger)' : 'var(--text)',
          transition: 'all 0.2s ease',
          width: '100%',
        }}
      >
        {urgent ? '🔥 Urgent ticket' : '💤 Normal ticket'}
      </div>
      <button className="btn" onClick={() => setUrgent((u) => !u)}>
        Toggle urgency
      </button>
    </>
  );
}

export default function Styling() {
  return (
    <article>
      <PageHeader topic={topic}>
        React doesn't prescribe one styling approach — CSS files with className, inline
        style objects, and conditional class names each solve a different problem.
      </PageHeader>

      <h2>Three approaches, side by side</h2>
      <CodeBlock
        title="CSS file + className — for anything reusable"
        code={`/* card.css */
.card { border-radius: 12px; padding: 16px; }

import './card.css';
<div className="card">Content</div>`}
      />
      <CodeBlock
        title="Inline style — for values computed at runtime"
        code={`<div style={{
  transform: \`translateX(\${offset}px)\`,
  opacity: visible ? 1 : 0,
}}>
  Content
</div>`}
      />
      <CodeBlock
        title="Conditional className — for state-driven variants"
        code={`<div className={\`card \${urgent ? 'card--urgent' : ''}\`}>
  Content
</div>`}
      />

      <Callout type="tip" title="Picking between them">
        Static, reusable styling → a CSS class. A value that only exists at runtime and
        can't be expressed as a fixed set of classes (a drag position, a computed color) →
        inline <code>style</code>. Swapping between a few known visual states based on
        props or state → a conditionally applied class name is usually cleanest, since
        it keeps the actual CSS in a stylesheet where browser devtools and CSS tooling
        can see it.
      </Callout>

      <p>
        This project's own design system is built the same way: CSS custom properties
        (<code>--accent</code>, <code>--bg</code>, …) defined once for both light and
        dark mode, consumed everywhere as <code>var(--accent)</code> — one visual
        language, driven by data instead of duplicated color values.
      </p>

      <h2>Try it</h2>
      <p>The urgency toggle switches classes and inline color values together.</p>
      <DemoCard label="State-driven styling">
        <StylingDemo />
      </DemoCard>

      <Quiz
        question="You need a card's translateX position to follow the mouse in real time. Which approach fits best?"
        options={[
          'A CSS class for every possible pixel position',
          'An inline style object computed from state, e.g. style={{ transform: `translateX(${x}px)` }}',
          "It's not possible to do this in React",
        ]}
        correctIndex={1}
        explanation="a continuous, runtime-computed value like a drag position has no fixed set of classes to enumerate — inline styles let you compute the exact value from state on every render."
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
