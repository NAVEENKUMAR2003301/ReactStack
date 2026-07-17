import { useState } from 'react';
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

const topic = TOPICS.find((t) => t.slug === 'lifting-state');

function TempInput({ label, value, onChange }) {
  return (
    <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block' }}>
      {label}
      <input
        type="number"
        className="input"
        value={Math.round(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ display: 'block', marginTop: 4 }}
      />
    </label>
  );
}

function LiftingDemo() {
  const [celsius, setCelsius] = useState(20);

  return (
    <div className="btn-row" style={{ alignItems: 'flex-start' }}>
      <TempInput label="Celsius" value={celsius} onChange={setCelsius} />
      <TempInput
        label="Fahrenheit"
        value={celsius * 9 / 5 + 32}
        onChange={(f) => setCelsius((f - 32) * 5 / 9)}
      />
    </div>
  );
}

export default function LiftingState() {
  return (
    <article>
      <PageHeader topic={topic}>
        When two sibling components need to stay in sync, move their shared state up to
        the nearest common parent, and pass it back down as props.
      </PageHeader>

      <p>
        A Celsius input and a Fahrenheit input need to agree with each other — type in
        one, the other updates. If each managed its own local state, they'd have no way
        to communicate. The fix: neither owns the temperature. Their shared parent does,
        as a single <code>celsius</code> value, and both inputs become controlled views
        of that one source of truth.
      </p>

      <CodeBlock
        title="One source of truth, two views of it"
        code={`function TemperatureConverter() {
  const [celsius, setCelsius] = useState(20);

  return (
    <>
      <TempInput
        label="Celsius"
        value={celsius}
        onChange={setCelsius}
      />
      <TempInput
        label="Fahrenheit"
        value={celsius * 9 / 5 + 32}
        onChange={(f) => setCelsius((f - 32) * 5 / 9)}
      />
    </>
  );
}`}
      />

      <FlowDiagram
        steps={[
          { icon: '⌨️', label: 'Type in Fahrenheit' },
          { icon: '⬆️', label: 'onChange lifts value to parent' },
          { icon: '🧮', label: 'Parent converts & stores celsius' },
          { icon: '⬇️', label: 'Both inputs re-render from celsius' },
        ]}
      />

      <Callout type="why" title="Why this beats syncing two states with useEffect">
        You could give each input its own state and use an effect to copy one into the
        other whenever it changes — but now there are two numbers that can briefly
        disagree, extra renders to reconcile them, and a subtle bug risk if the effect's
        dependencies are wrong. One state, two derived views, has no synchronization step
        because there's nothing to keep in sync — there's only one truth.
      </Callout>

      <h2>Try it</h2>
      <DemoCard
        label="Two inputs, one shared source of truth"
        code={`function TempInput({ label, value, onChange }) {
  return (
    <label>
      {label}
      <input value={Math.round(value)} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function LiftingDemo() {
  const [celsius, setCelsius] = useState(20);
  return (
    <>
      <TempInput label="Celsius" value={celsius} onChange={setCelsius} />
      <TempInput
        label="Fahrenheit"
        value={(celsius * 9) / 5 + 32}
        onChange={(f) => setCelsius(((f - 32) * 5) / 9)}
      />
    </>
  );
}`}
      >
        <LiftingDemo />
      </DemoCard>

      <h2>What actually happens when you edit Fahrenheit</h2>
      <StepThrough
        title="Tracing one edit of the Fahrenheit field"
        steps={[
          {
            icon: '⌨️',
            label: 'Type',
            explain: 'You change the Fahrenheit input. Its onChange calls onChange(f) with the new number, which was passed in as (f) => setCelsius((f - 32) * 5 / 9).',
            preview: 'Fahrenheit input: 68 → 77',
          },
          {
            icon: '🧮',
            label: 'Convert',
            explain: 'That handler converts the new Fahrenheit value back to Celsius before storing anything — celsius is the only value ever kept in state.',
            preview: 'setCelsius(25) scheduled',
          },
          {
            icon: '🔁',
            label: 'Parent re-runs',
            explain: 'LiftingDemo re-runs with the new celsius. Both TempInput calls are re-evaluated from that single value.',
            preview: 'celsius === 25',
          },
          {
            icon: '📦',
            label: 'Both props recomputed',
            explain: 'The Celsius TempInput gets value={25} directly; the Fahrenheit TempInput gets value={25 * 9/5 + 32}, recomputed fresh — not read from any stored Fahrenheit state.',
            preview: 'Celsius=25, Fahrenheit=77 (derived)',
          },
          {
            icon: '🖥️',
            label: 'Commit',
            explain: 'Both inputs update together in the same render — they can never disagree, because there was only ever one source of truth to begin with.',
            preview: 'both fields show matching temperatures',
          },
        ]}
      />

      <Quiz
        question="Where is the Fahrenheit value actually stored between renders?"
        options={[
          "In its own useState inside the Fahrenheit TempInput",
          "It isn't stored anywhere — it's recalculated from celsius on every render",
          "In a ref shared between both inputs",
        ]}
        correctIndex={1}
        explanation="celsius * 9/5 + 32 is computed fresh every time LiftingDemo renders — there's no separate Fahrenheit state to keep in sync, so it's mathematically impossible for the two to disagree."
      />
      <Quiz
        question="What would go wrong if each TempInput kept its own local useState instead of being controlled by the shared parent?"
        options={[
          "Nothing, as long as both start with the same initial value",
          "Typing in one input would have no way to update the other — they'd be two independent, unsynchronized values",
          "React would throw an error for having two inputs",
        ]}
        correctIndex={1}
        explanation="local state is private to each component — for two components to stay in sync, the state they share has to live in a common ancestor that both read from, which is exactly what 'lifting state up' means."
      />

      <RealWorld title="Filters and results staying in sync">
        <p>
          A product listing page (think Amazon's left sidebar) has a filter panel and a
          results grid that must always agree. Neither owns the filters — their shared
          parent does, exactly like the temperature example, just with a filters object
          instead of a number.
        </p>
        <CodeBlock
          title="ProductListPage.jsx"
          code={`function ProductListPage() {
  const [filters, setFilters] = useState({ category: 'all', maxPrice: 100 });
  const results = products.filter((p) => matchesFilters(p, filters));

  return (
    <>
      <FilterPanel filters={filters} onChange={setFilters} />
      <ResultsGrid products={results} />
    </>
  );
}`}
        />
      </RealWorld>

      <Quiz
        question="Why does the parent store only celsius, and compute fahrenheit inline, rather than storing both in separate state?"
        options={[
          "Storing both would use too much memory",
          "One derived value can never disagree with the other — there's nothing to keep in sync",
          "React doesn't allow a component to have two pieces of state",
        ]}
        correctIndex={1}
        explanation="deriving fahrenheit from celsius on every render guarantees they always agree — if both were separate state, some code path could update one without the other, and now they can drift apart."
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
