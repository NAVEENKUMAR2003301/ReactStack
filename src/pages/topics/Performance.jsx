import { useMemo, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavFooter from '../../components/PageNavFooter';
import CodeBlock from '../../components/CodeBlock';
import DemoCard from '../../components/DemoCard';
import StepThrough from '../../components/StepThrough';
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

      <h2>What actually happens when you click &ldquo;Re-render&rdquo; with memoization on</h2>
      <StepThrough
        title="Tracing a re-render that doesn't change n"
        steps={[
          {
            icon: '👆',
            label: 'Click',
            explain: 'You click "Re-render" without touching n. This calls setTick(t => t + 1) — a state change unrelated to n.',
            preview: 'tick update scheduled',
          },
          {
            icon: '🔁',
            label: 'Component re-runs',
            explain: 'React re-runs PerformanceDemo, as it does for any state change — the whole function body executes again.',
            preview: 'PerformanceDemo() runs again',
          },
          {
            icon: '🔍',
            label: 'useMemo checks deps',
            explain: 'React reaches useMemo(() => slowIsPrime(n), [n, memoized ? 0 : tick]). With memoized true, that array is [n, 0] — and 0 never changes, so this array is identical to last render\'s.',
            preview: '[97, 0] === [97, 0] → unchanged',
          },
          {
            icon: '📦',
            label: 'Cached value reused',
            explain: 'Because the dependency array is unchanged, React skips calling slowIsPrime entirely and returns the cached result from last time.',
            preview: 'slowIsPrime NOT called — cache hit',
          },
          {
            icon: '🖥️',
            label: 'Commit',
            explain: 'Only the tick count in the button label updates on screen — ms stays near 0ms, since no expensive work actually ran.',
            preview: '"Re-render (1) without changing n", ~0ms',
          },
        ]}
      />

      <Quiz
        question="If you uncheck 'use useMemo' and click Re-render, what changes about the dependency array useMemo evaluates?"
        options={[
          "Nothing changes, the array stays [n, 0]",
          "It becomes [n, tick] — since tick now changes on every click, the array differs from the previous render every time",
          "useMemo stops being called entirely",
        ]}
        correctIndex={1}
        explanation="the demo's memoized checkbox swaps the second dependency between a constant (0) and the actual changing tick — that's what forces slowIsPrime to recompute on every click when memoization is 'off', without breaking the rule that hooks must run unconditionally."
      />
      <Quiz
        question="Why does the demo say useMemo has its own cost, rather than being a free performance win?"
        options={[
          "It has no real cost, the warning is just cautious wording",
          "React still has to store the previous dependency array and compare it against the new one on every render, which itself takes time and memory",
          "useMemo re-runs the calculation twice to verify the cached value",
        ]}
        correctIndex={1}
        explanation="the comparison-and-cache bookkeeping isn't free — for a cheap calculation, that overhead can outweigh just redoing the work, which is why useMemo is worth reaching for only once a real cost has been measured."
      />

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
