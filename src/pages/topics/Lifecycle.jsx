import { useEffect, useRef, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavFooter from '../../components/PageNavFooter';
import CodeBlock from '../../components/CodeBlock';
import DemoCard from '../../components/DemoCard';
import Callout from '../../components/Callout';
import FlowDiagram from '../../components/FlowDiagram';
import Quiz from '../../components/Quiz';
import { TOPICS } from '../../data/topics';

const topic = TOPICS.find((t) => t.slug === 'lifecycle');

function LifecycleDemo() {
  const [count, setCount] = useState(0);
  const [log, setLog] = useState([]);
  const renderPhase = useRef(0);

  renderPhase.current += 1;
  const thisRender = renderPhase.current;

  useEffect(() => {
    setLog((l) => [...l, `commit #${thisRender}: effect ran, DOM is updated`].slice(-4));
    // thisRender is captured intentionally to log which render this effect belongs to
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <>
      <button className="btn btn--primary" onClick={() => setCount((c) => c + 1)}>
        Trigger render #{count + 1}
      </button>
      <div style={{ width: '100%', textAlign: 'left', fontFamily: 'var(--mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        {log.map((entry, i) => (
          <div key={i}>{entry}</div>
        ))}
      </div>
    </>
  );
}

export default function Lifecycle() {
  return (
    <article>
      <PageHeader topic={topic}>
        "Re-render" isn't one instantaneous step — it's render, then commit, then effects
        — three distinct phases that happen in a fixed order, every single update.
      </PageHeader>

      <FlowDiagram
        steps={[
          { icon: '🧠', label: 'Trigger (state/props change)' },
          { icon: '📝', label: 'Render: call the function' },
          { icon: '🌳', label: 'Diff against previous tree' },
          { icon: '🖥️', label: 'Commit: update the real DOM' },
          { icon: '⚡', label: 'Run effects' },
        ]}
      />

      <h2>1. Render — calculate what should be on screen</h2>
      <p>
        React calls your component function. It returns JSX describing what the UI
        <em>should</em> look like given the current props and state. Nothing touches the
        real DOM yet — this is pure calculation, and it should have{' '}
        <strong>no side effects</strong> (no DOM mutation, no network calls — that's why
        those belong in <code>useEffect</code>, not directly in the component body).
      </p>

      <h2>2. Reconciliation — find the difference</h2>
      <p>
        React compares the newly returned JSX tree against the tree from the previous
        render, and computes the minimal set of changes needed — this diffing algorithm
        is what lets React update only the parts of the DOM that actually changed,
        instead of re-building everything.
      </p>

      <h2>3. Commit — touch the real DOM</h2>
      <p>
        React applies that minimal set of changes to the actual browser DOM. This is the
        one phase with real side effects on the page — text updates, attribute changes,
        nodes added or removed.
      </p>

      <h2>4. Effects — run after the screen is updated</h2>
      <p>
        Only after the DOM reflects the new render does React run your{' '}
        <code>useEffect</code> callbacks. That ordering is deliberate: an effect that
        measures a DOM node, or wires up something that expects final layout, always sees
        the up-to-date DOM.
      </p>

      <CodeBlock
        title="The order, made visible"
        code={`function Widget({ count }) {
  console.log('1. render');           // during render

  useEffect(() => {
    console.log('3. effect');          // after commit
    return () => console.log('cleanup, before next effect');
  }, [count]);

  return <div ref={(node) => console.log('2. commit — DOM node exists now')}>
    {count}
  </div>;
}`}
      />

      <Callout type="why" title="Why this order matters in practice">
        It's why you can't read an updated DOM measurement synchronously right after
        calling a state setter — the DOM hasn't committed yet. And it's why{' '}
        <code>useEffect</code> is the right place for anything that needs the DOM to
        already reflect the latest render: it always runs after commit, guaranteed.
      </Callout>

      <h2>Try it</h2>
      <p>Each click triggers all three phases — watch the effect's log line always appear after the click resolves.</p>
      <DemoCard label="Render → commit → effect, observed">
        <LifecycleDemo />
      </DemoCard>

      <Quiz
        question="Why shouldn't you mutate the DOM directly inside a component's render body (not in useEffect)?"
        options={[
          "It works fine, it's just a style preference",
          "Render should be a pure calculation of JSX — the real DOM doesn't exist to update until the commit phase happens",
          "Because JSX doesn't allow any DOM APIs to be imported",
        ]}
        correctIndex={1}
        explanation="the render phase only computes what the UI should look like — React hasn't touched the actual DOM yet at that point, and render can even run multiple times without committing (e.g. in Strict Mode or when interrupted), so side effects there are unsafe and belong in an effect, which runs after commit."
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
