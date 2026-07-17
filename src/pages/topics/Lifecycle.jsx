import { useEffect, useRef, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavFooter from '../../components/PageNavFooter';
import CodeBlock from '../../components/CodeBlock';
import DemoCard from '../../components/DemoCard';
import StepThrough from '../../components/StepThrough';
import Callout from '../../components/Callout';
import FlowDiagram from '../../components/FlowDiagram';
import RealWorld from '../../components/RealWorld';
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
      <DemoCard
        label="Render → commit → effect, observed"
        code={[
          'function LifecycleDemo() {',
          '  const [count, setCount] = useState(0);',
          '  const [log, setLog] = useState([]);',
          '',
          '  useEffect(() => {',
          "    setLog((l) => [...l, `commit #${count}: effect ran, DOM is updated`]);",
          '  }, [count]); // runs after every commit caused by a count change',
          '',
          '  return (',
          '    <>',
          '      <button onClick={() => setCount((c) => c + 1)}>Trigger render</button>',
          '      {log.map((entry, i) => <div key={i}>{entry}</div>)}',
          '    </>',
          '  );',
          '}',
        ].join('\n')}
      >
        <LifecycleDemo />
      </DemoCard>

      <h2>What actually happens when you click &ldquo;Trigger render&rdquo;</h2>
      <StepThrough
        title="Tracing all three phases for one click"
        steps={[
          {
            icon: '🧠',
            label: 'Trigger',
            explain: 'You click the button, calling setCount(c => c + 1) — this is the trigger that starts the whole sequence.',
            preview: 'count update scheduled',
          },
          {
            icon: '📝',
            label: 'Render',
            explain: 'React calls LifecycleDemo() again. renderPhase.current += 1 runs here — this is pure calculation, nothing on the real page has changed yet.',
            preview: 'function runs, returns new JSX',
          },
          {
            icon: '🌳',
            label: 'Reconcile',
            explain: 'React diffs the newly returned JSX against what was on screen before, computing the minimal set of real changes needed (just the button\'s text, in this case).',
            preview: 'diff computed: button label changed',
          },
          {
            icon: '🖥️',
            label: 'Commit',
            explain: 'React applies that diff to the actual DOM. Only now does the button\'s label actually change on the page.',
            preview: 'DOM updated: "Trigger render #2"',
          },
          {
            icon: '⚡',
            label: 'Effects',
            explain: 'Only after the commit is done does the useEffect callback run, appending a new log line — guaranteed to happen after the DOM is already up to date.',
            preview: '"commit #2: effect ran, DOM is updated"',
          },
        ]}
      />

      <Quiz
        question="At the 'Render' step, has the button's visible label on the page already changed?"
        options={[
          "Yes, render updates the screen immediately",
          "No — render only produces a new JSX description; the real DOM isn't touched until the commit step",
          "Only the label changes during render, other attributes wait for commit",
        ]}
        correctIndex={1}
        explanation="render is pure calculation — React can even call it more than once without committing (e.g. under Strict Mode) — so nothing on the actual page changes until the separate commit phase runs."
      />
      <Quiz
        question="Why does the effect's log line always show 'DOM is updated' as already true, never 'about to update'?"
        options={[
          "It's just a description choice with no technical reason",
          "useEffect callbacks are guaranteed to run after the commit phase, so the DOM has always already been updated by the time an effect runs",
          "Effects run before commit, so the message is inaccurate",
        ]}
        correctIndex={1}
        explanation="that ordering — trigger, render, commit, then effects — is a fixed guarantee in React, which is exactly why effects are the safe place to read layout or trigger anything that depends on the DOM being current."
      />

      <RealWorld title="Sizing a chart canvas to its container">
        <p>
          A charting library often needs the pixel width of its container to draw
          correctly — but that width doesn't exist until after the DOM commits. Reading{' '}
          <code>getBoundingClientRect()</code> inside an effect (never during render)
          guarantees the container has actually been painted first.
        </p>
        <CodeBlock
          title="ResponsiveChart.jsx"
          code={`function ResponsiveChart() {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // safe here — the DOM has already committed by this point
    setWidth(containerRef.current.getBoundingClientRect().width);
  }, []);

  return <div ref={containerRef}><Chart width={width} /></div>;
}`}
        />
      </RealWorld>

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
