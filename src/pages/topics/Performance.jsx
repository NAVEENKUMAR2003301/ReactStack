import { useMemo, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavFooter from '../../components/PageNavFooter';
import CodeBlock from '../../components/CodeBlock';
import DemoCard from '../../components/DemoCard';
import Callout from '../../components/Callout';
import RealWorld from '../../components/RealWorld';
import Quiz from '../../components/Quiz';
import { TOPICS } from '../../data/topics';

const topic = TOPICS.find((t) => t.slug === 'performance');

function slowIsPrime(n) {
  if (n < 2) return false;
  for (let i = 0; i < 3_000_000; i++) {
    /* burn cycles to simulate an expensive calculation */
  }
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function PerformanceDemo() {
  const [n, setN] = useState(97);
  const [tick, setTick] = useState(0);
  const [memoized, setMemoized] = useState(true);

  const computeStart = performance.now();
  // Hooks must run unconditionally on every render, so instead of skipping
  // useMemo when "memoized" is off, we vary its dependency array: including
  // `tick` forces a recompute on every click, same effect without breaking
  // the rules of hooks.
  const isPrime = useMemo(() => slowIsPrime(n), [n, memoized ? 0 : tick]);
  const ms = (performance.now() - computeStart).toFixed(1);

  return (
    <>
      <div className="btn-row">
        <input
          className="input"
          type="number"
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          style={{ maxWidth: 100 }}
        />
        <button className="btn" onClick={() => setTick((t) => t + 1)}>
          Re-render ({tick}) without changing n
        </button>
      </div>
      <label style={{ fontSize: '0.82rem' }}>
        <input type="checkbox" checked={memoized} onChange={(e) => setMemoized(e.target.checked)} /> use useMemo
      </label>
      <p style={{ margin: 0 }}>
        <strong>{n}</strong> is {isPrime ? '' : 'not '}prime — computed in{' '}
        <strong>{ms}ms</strong> this render.
      </p>
      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        Click "Re-render" — with memoization on, the calculation is skipped (~0ms) since{' '}
        <code>n</code> didn't change. Turn it off and every re-render redoes the slow work.
      </p>
    </>
  );
}

export default function Performance() {
  return (
    <article>
      <PageHeader topic={topic}>
        useMemo caches an expensive computed value, and useCallback caches a function
        reference — both skip unnecessary work between renders when their inputs haven't
        changed.
      </PageHeader>

      <p>
        Every state update re-runs the whole component function. Most of the time that's
        cheap and not worth thinking about. But an expensive calculation, or a function
        passed down to a memoized child, re-created on every render, can become a real
        cost. <code>useMemo</code> and <code>useCallback</code> let you tell React
        "only redo this if these specific values changed."
      </p>

      <CodeBlock
        title="useMemo — cache a computed value"
        code={`const isPrime = useMemo(() => slowIsPrime(n), [n]);
// re-runs slowIsPrime only when n changes,
// reuses the cached result on every other re-render`}
      />
      <CodeBlock
        title="useCallback — cache a function reference"
        code={`const handleAdd = useCallback(() => {
  setItems((items) => [...items, newItem]);
}, []); // same function identity across renders

// useful when handleAdd is a prop to a memoized child —
// React.memo(Child) skips re-rendering only if props are ===`}
      />

      <Callout type="warn" title="Don't reach for these by default">
        Memoization has its own cost — storing the previous inputs and comparing them
        every render. For cheap calculations, that bookkeeping can cost more than just
        redoing the work. Reach for <code>useMemo</code>/<code>useCallback</code> when
        you've noticed an actual slowdown (a heavy calculation, a large list re-rendering,
        or a memoized child re-rendering unnecessarily) — not as a reflex on every value.
      </Callout>

      <h2>Try it</h2>
      <p>
        <code>slowIsPrime</code> is deliberately slowed down. Toggle memoization off and
        watch re-renders (that don't even change <code>n</code>) get slow again.
      </p>
      <DemoCard
        label="Memoized vs. unmemoized computation"
        code={`// the essential pattern (this demo also lets you toggle memoization
// off, which needs an extra trick to stay hooks-rule-compliant —
// see the full source for that detail):
function PerformanceDemo() {
  const [n, setN] = useState(97);
  const isPrime = useMemo(() => slowIsPrime(n), [n]);

  return <p>{n} is {isPrime ? '' : 'not '}prime</p>;
}`}
      >
        <PerformanceDemo />
      </DemoCard>

      <RealWorld title="Filtering a large data table without lag">
        <p>
          A dashboard with thousands of rows, a search box, and a sort toggle can easily
          spend 50ms+ re-filtering and re-sorting on every unrelated re-render (like the
          sidebar collapsing). Wrapping that computation in <code>useMemo</code> keyed on
          the actual inputs — the raw data, the query, the sort key — means it only
          redoes the work when one of those genuinely changes.
        </p>
        <CodeBlock
          title="DataTable.jsx"
          code={`function DataTable({ rows, query, sortKey }) {
  const visibleRows = useMemo(() => {
    return rows
      .filter((r) => r.name.includes(query))
      .sort((a, b) => a[sortKey] - b[sortKey]);
  }, [rows, query, sortKey]);

  return <Table rows={visibleRows} />;
}`}
        />
      </RealWorld>

      <Quiz
        question="When is useMemo(() => computeThing(x), [x]) actually worth adding?"
        options={[
          "On every calculated value in every component, as a default habit",
          "When computeThing is measurably expensive and you've confirmed re-renders are happening with an unchanged x",
          "Only inside useEffect, never in the component body",
        ]}
        correctIndex={1}
        explanation="memoization itself has overhead — it earns its keep only when the wrapped computation is expensive enough that skipping it on unrelated re-renders is a net win, which is something worth confirming rather than assuming."
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
