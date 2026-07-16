import { useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../../components/PageHeader';
import PageNavFooter from '../../components/PageNavFooter';
import CodeBlock from '../../components/CodeBlock';
import DemoCard from '../../components/DemoCard';
import Callout from '../../components/Callout';
import FlowDiagram from '../../components/FlowDiagram';
import RealWorld from '../../components/RealWorld';
import Quiz from '../../components/Quiz';
import { TOPICS } from '../../data/topics';

const topic = TOPICS.find((t) => t.slug === 'state');

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <>
      <motion.div
        key={count}
        initial={{ scale: 1.3, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--heading)' }}
      >
        {count}
      </motion.div>
      <div className="btn-row">
        <button className="btn" onClick={() => setCount((c) => c - 1)}>− 1</button>
        <button className="btn btn--primary" onClick={() => setCount(0)}>Reset</button>
        <button className="btn" onClick={() => setCount((c) => c + 1)}>+ 1</button>
      </div>
    </>
  );
}

export default function StateTopic() {
  return (
    <article>
      <PageHeader topic={topic}>
        State is data a component remembers between renders — and when it changes,
        React re-renders the component to reflect the new value.
      </PageHeader>

      <p>
        A plain variable inside a function component resets on every render, because the
        function just runs again from scratch. <code>useState</code> is a Hook that asks
        React to remember a value <em>outside</em> of that function call, tied to this
        exact component instance.
      </p>

      <CodeBlock
        title="useState basics"
        code={`import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  //     ^value   ^setter    ^initial value

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}`}
      />

      <FlowDiagram
        steps={[
          { icon: '👆', label: 'setCount() called' },
          { icon: '📌', label: 'React schedules update' },
          { icon: '🔁', label: 'Component function re-runs' },
          { icon: '🆕', label: 'New JSX returned' },
          { icon: '🖥️', label: 'DOM updated to match' },
        ]}
        activeIndex={2}
      />

      <h2>Calling the setter is the whole mechanism</h2>
      <p>
        <code>setCount(count + 1)</code> doesn't mutate <code>count</code> in place — it
        tells React "next render, this state should be this new value." React then
        re-runs the component function, and <code>useState</code> returns the updated
        value that render.
      </p>

      <Callout type="warn" title="Updates can be batched">
        Calling <code>setCount(count + 1)</code> three times in a row does{' '}
        <strong>not</strong> add 3 — each call closes over the same stale{' '}
        <code>count</code> from that render. Use the <strong>updater function</strong>{' '}
        form, <code>setCount(c ={'>'} c + 1)</code>, when the new value depends on the
        previous one — it always receives the latest pending value.
      </Callout>

      <h2>Try it</h2>
      <DemoCard
        label="A component with memory"
        code={`function Counter() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>{count}</div>
      <button onClick={() => setCount((c) => c - 1)}>− 1</button>
      <button onClick={() => setCount(0)}>Reset</button>
      <button onClick={() => setCount((c) => c + 1)}>+ 1</button>
    </>
  );
}`}
      >
        <Counter />
      </DemoCard>

      <RealWorld title="A quantity stepper at checkout">
        <p>
          The "− 1 / 2 / + 1" quantity control on a checkout page is the counter demo
          with a real job: <code>quantity</code> is state, the buttons call{' '}
          <code>setQuantity</code>, and the line total re-renders automatically because
          it's derived from that same state on every render.
        </p>
        <CodeBlock
          title="QuantityStepper.jsx"
          code={`function QuantityStepper({ price }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div>
      <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
      <span>{quantity}</span>
      <button onClick={() => setQuantity((q) => q + 1)}>+</button>
      <p>Total: \${(price * quantity).toFixed(2)}</p>
    </div>
  );
}`}
        />
      </RealWorld>

      <Quiz
        question="Why does clicking a button that runs setCount(count + 1) three times in one handler only increase the count by 1, not 3?"
        options={[
          "It's a bug in React",
          'Each call captured the same stale "count" value from that render',
          'useState only allows one update per second',
        ]}
        correctIndex={1}
        explanation="all three calls read the same `count` from the closure of that render, so they all compute the same next value — the fix is the updater function form, c => c + 1."
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
