import { createContext, useContext, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavFooter from '../../components/PageNavFooter';
import CodeBlock from '../../components/CodeBlock';
import DemoCard from '../../components/DemoCard';
import Callout from '../../components/Callout';
import FlowDiagram from '../../components/FlowDiagram';
import Quiz from '../../components/Quiz';
import { TOPICS } from '../../data/topics';

const topic = TOPICS.find((t) => t.slug === 'context');

const AccentContext = createContext('purple');

function DeepButton() {
  const accent = useContext(AccentContext);
  const colors = { purple: '#7c3aed', pink: '#db2777', teal: '#0d9488' };
  return (
    <button
      className="btn"
      style={{ borderColor: colors[accent], color: colors[accent] }}
    >
      I read context, 3 levels deep
    </button>
  );
}
function MiddleWrapper() {
  return (
    <div style={{ border: '1px dashed var(--border-strong)', padding: 12, borderRadius: 8 }}>
      <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)', margin: '0 0 8px' }}>
        Middle component — never touches "accent"
      </p>
      <DeepButton />
    </div>
  );
}

function ContextDemo() {
  const [accent, setAccent] = useState('purple');
  return (
    <AccentContext.Provider value={accent}>
      <div className="btn-row">
        {['purple', 'pink', 'teal'].map((c) => (
          <button key={c} className="btn btn--sm" onClick={() => setAccent(c)}>
            {c}
          </button>
        ))}
      </div>
      <MiddleWrapper />
    </AccentContext.Provider>
  );
}

export default function ContextTopic() {
  return (
    <article>
      <PageHeader topic={topic}>
        Context lets a value skip past every intermediate component and be read directly
        by any descendant — solving "prop drilling" through components that don't care
        about that value.
      </PageHeader>

      <p>
        Passing data down five levels of props, where three of those levels only forward
        it without using it, is called <strong>prop drilling</strong>. Context fixes this:
        wrap a subtree in a <code>Provider</code> with a value, and any descendant can
        call <code>useContext</code> to read it directly — no matter how deep.
      </p>

      <CodeBlock
        title="Creating, providing, and consuming context"
        code={`const AccentContext = createContext('purple');

function App() {
  const [accent, setAccent] = useState('purple');
  return (
    <AccentContext.Provider value={accent}>
      <MiddleWrapper /> {/* doesn't touch accent at all */}
    </AccentContext.Provider>
  );
}

function DeepButton() {
  const accent = useContext(AccentContext); // reads it directly
  return <button style={{ color: accent }}>Themed</button>;
}`}
      />

      <FlowDiagram
        steps={[
          { icon: '📦', label: 'Provider sets value' },
          { icon: '➡️', label: 'MiddleWrapper (skipped)' },
          { icon: '🎯', label: 'DeepButton reads it directly' },
        ]}
      />

      <Callout type="warn" title="Context is not a global state manager">
        Context is great for values that are truly "ambient" to a subtree — theme,
        current user, locale. It's not a replacement for well-designed local state: every
        component that reads a context re-renders whenever that context's value changes,
        so cramming fast-changing, unrelated data into one big context can cause
        unnecessary re-renders across your app.
      </Callout>

      <h2>Try it</h2>
      <p>
        <code>MiddleWrapper</code> never receives or forwards an <code>accent</code> prop
        — <code>DeepButton</code> reads it straight from context.
      </p>
      <DemoCard label="Context skipping a level">
        <ContextDemo />
      </DemoCard>

      <Quiz
        question="Why use Context instead of just passing accent as a prop through MiddleWrapper?"
        options={[
          "Context is always faster than passing props",
          "MiddleWrapper doesn't use accent at all — forcing it to accept and forward the prop couples it to a concern it doesn't have",
          "Props can only be passed one level deep in React",
        ]}
        correctIndex={1}
        explanation="prop drilling forces every intermediate component to know about and forward data it doesn't use, coupling unrelated components together — context lets the one component that actually needs the value read it directly."
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
