import { useRef, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavFooter from '../../components/PageNavFooter';
import CodeBlock from '../../components/CodeBlock';
import DemoCard from '../../components/DemoCard';
import Callout from '../../components/Callout';
import RealWorld from '../../components/RealWorld';
import Quiz from '../../components/Quiz';
import { TOPICS } from '../../data/topics';

const topic = TOPICS.find((t) => t.slug === 'use-ref');

function FocusDemo() {
  const inputRef = useRef(null);
  const renderCount = useRef(0);
  const [value, setValue] = useState('');

  renderCount.current += 1;

  return (
    <>
      <input
        ref={inputRef}
        className="input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Click the button to focus me"
      />
      <div className="btn-row">
        <button className="btn btn--primary" onClick={() => inputRef.current.focus()}>
          Focus the input
        </button>
      </div>
      <p style={{ margin: 0, fontSize: '0.82rem' }}>
        This component has rendered <strong>{renderCount.current}</strong> times —{' '}
        <code>renderCount</code> is a ref, so updating it never triggers a re-render
        itself (it only reflects the count because typing does).
      </p>
    </>
  );
}

export default function UseRef() {
  return (
    <article>
      <PageHeader topic={topic}>
        useRef gives you a mutable box that persists across renders without causing a
        re-render when it changes — perfect for DOM handles and "don't render" values.
      </PageHeader>

      <p>
        <code>useRef(initialValue)</code> returns an object shaped like{' '}
        <code>{'{ current: initialValue }'}</code>. That object is the same object on
        every render — mutate <code>ref.current</code> directly, and React won't
        re-render because of it. That's the key difference from <code>useState</code>.
      </p>

      <CodeBlock
        title="Two uses of useRef"
        code={`// 1. Reference a DOM node
const inputRef = useRef(null);
<input ref={inputRef} />
inputRef.current.focus();

// 2. Store a mutable value that shouldn't trigger renders
const renderCount = useRef(0);
renderCount.current += 1; // no re-render happens`}
      />

      <h2>useState vs. useRef</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', margin: '16px 0' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '8px 0' }}></th>
            <th>useState</th>
            <th>useRef</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <td style={{ padding: '8px 0', color: 'var(--text-muted)' }}>Changing it re-renders?</td>
            <td>Yes</td>
            <td>No</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <td style={{ padding: '8px 0', color: 'var(--text-muted)' }}>Value available in JSX?</td>
            <td>Always current</td>
            <td>Can read stale mid-render</td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', color: 'var(--text-muted)' }}>Typical use</td>
            <td>Anything shown on screen</td>
            <td>DOM refs, timers, previous values</td>
          </tr>
        </tbody>
      </table>

      <Callout type="tip" title="Rule of thumb">
        If a value needs to show up in the UI, it's state. If it's plumbing the UI
        doesn't display — a timer id, a scroll position you're only reading in an event
        handler, a DOM node — it's a ref.
      </Callout>

      <h2>Try it</h2>
      <DemoCard
        label="A DOM ref and a render-count ref"
        code={`function FocusDemo() {
  const inputRef = useRef(null);
  const renderCount = useRef(0);
  const [value, setValue] = useState('');

  renderCount.current += 1; // mutating a ref never re-renders

  return (
    <>
      <input ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={() => inputRef.current.focus()}>Focus the input</button>
      <p>Rendered {renderCount.current} times</p>
    </>
  );
}`}
      >
        <FocusDemo />
      </DemoCard>

      <RealWorld title="Autofocusing a modal's first field">
        <p>
          When a modal (like a "New task" dialog) opens, good UX puts the cursor
          straight into its first input — no click required. That's a DOM operation
          (<code>.focus()</code>), which only makes sense once the input actually
          exists in the DOM, so it belongs in an effect that runs on mount, using a ref
          to reach the real node.
        </p>
        <CodeBlock
          title="NewTaskModal.jsx"
          code={`function NewTaskModal() {
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current.focus();
  }, []);

  return <input ref={titleRef} placeholder="Task title" />;
}`}
        />
      </RealWorld>

      <Quiz
        question="Why doesn't incrementing renderCount.current trigger a re-render?"
        options={[
          "It's a bug — refs should trigger re-renders too",
          "Refs are designed to mutate silently; React only re-renders in response to state setters",
          "renderCount.current is read-only and can't actually be changed",
        ]}
        correctIndex={1}
        explanation="a ref's .current property is a plain mutable field — React never watches it for changes, which is exactly why refs are the right tool for values that shouldn't cause a re-render."
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
