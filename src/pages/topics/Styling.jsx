import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavFooter from '../../components/PageNavFooter';
import CodeBlock from '../../components/CodeBlock';
import DemoCard from '../../components/DemoCard';
import StepThrough from '../../components/StepThrough';
import Callout from '../../components/Callout';
import RealWorld from '../../components/RealWorld';
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
      <DemoCard
        label="State-driven styling"
        code={[
          'function StylingDemo() {',
          '  const [urgent, setUrgent] = useState(false);',
          '  return (',
          '    <>',
          "      <div",
          "        className={`card${urgent ? ' is-urgent' : ''}`}",
          '        style={{ color: urgent ? \'var(--danger)\' : \'var(--text)\' }}',
          '      >',
          "        {urgent ? '🔥 Urgent ticket' : '💤 Normal ticket'}",
          '      </div>',
          '      <button onClick={() => setUrgent((u) => !u)}>Toggle urgency</button>',
          '    </>',
          '  );',
          '}',
        ].join('\n')}
      >
        <StylingDemo />
      </DemoCard>

      <h2>What actually happens when you click &ldquo;Toggle urgency&rdquo;</h2>
      <StepThrough
        title="Tracing one click of the toggle button"
        steps={[
          {
            icon: '👆',
            label: 'Click',
            explain: 'You click "Toggle urgency", which calls setUrgent(u => !u).',
            preview: 'urgent update scheduled',
          },
          {
            icon: '🔁',
            label: 'Re-run',
            explain: 'React re-runs StylingDemo. urgent is now true.',
            preview: 'urgent === true',
          },
          {
            icon: '🏷️',
            label: 'className recomputed',
            explain: 'The template string `card${urgent ? \' is-urgent\' : \'\'}` re-evaluates to "card is-urgent" instead of just "card".',
            preview: 'className: "card" → "card is-urgent"',
          },
          {
            icon: '🎨',
            label: 'style object recomputed',
            explain: 'The inline style object also recomputes: borderColor, background, and color all switch from their normal CSS variables to var(--danger) and var(--danger-soft).',
            preview: 'colors switch to the danger palette',
          },
          {
            icon: '🖥️',
            label: 'Commit',
            explain: 'React updates both the class attribute and the inline style attribute on the same DOM node in one commit — the card flips to its urgent look instantly.',
            preview: 'card now shows "🔥 Urgent ticket"',
          },
        ]}
      />

      <Quiz
        question="Why does the danger color come from var(--danger) instead of a hardcoded hex value like #b91c1c?"
        options={[
          "Hardcoded colors render faster",
          "Using the CSS variable means the color automatically adapts for dark mode, since --danger is redefined differently under :root[data-theme='dark']",
          "CSS variables are required for inline styles to work at all",
        ]}
        correctIndex={1}
        explanation="every color in this project routes through a CSS custom property so a single theme attribute flip re-themes the whole app — hardcoding a hex value would look wrong (or invisible) in dark mode."
      />
      <Quiz
        question="Could the class name and inline style updates in this demo get out of sync — one applied but not the other?"
        options={[
          "Yes, they update independently on separate renders",
          "No — both come from the same urgent state and are computed within the same render, so they always commit together",
          "Only if the browser is under heavy load",
        ]}
        correctIndex={1}
        explanation="both the className string and the style object are derived from the same urgent boolean during the same render pass — there's no scenario where one updates without the other, because there's nothing asynchronous between them."
      />

      <RealWorld title="This exact site's dark/light mode">
        <p>
          ReactStack's own theme toggle works with CSS custom properties, not
          conditional class names for every color: <code>--bg</code>, <code>--text</code>,{' '}
          <code>--accent</code> are redefined once for dark mode, and every component
          just uses <code>var(--bg)</code> — so a single attribute flip on{' '}
          <code>&lt;html&gt;</code> re-themes the entire app instantly.
        </p>
        <CodeBlock
          title="theme tokens"
          code={`:root {
  --bg: #ffffff;
  --text: #322d3a;
}
:root[data-theme='dark'] {
  --bg: #0e0d13;
  --text: #d7d4e0;
}

/* every component just does this — never a hardcoded color */
.card { background: var(--bg); color: var(--text); }`}
        />
      </RealWorld>

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
