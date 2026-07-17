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

const topic = TOPICS.find((t) => t.slug === 'props');

function PriceTag({ label, amount, currency = '$' }) {
  return (
    <div className="card" style={{ minWidth: 140 }}>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{label}</div>
      <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--heading)' }}>
        {currency}
        {amount}
      </div>
    </div>
  );
}

function PropsDemo() {
  const [amount, setAmount] = useState(42);
  return (
    <>
      <div className="btn-row">
        <PriceTag label="Plan A" amount={amount} />
        <PriceTag label="Plan B" amount={amount * 2} currency="€" />
      </div>
      <div className="btn-row">
        <button className="btn btn--sm" onClick={() => setAmount((a) => Math.max(0, a - 5))}>
          − 5
        </button>
        <button className="btn btn--sm" onClick={() => setAmount((a) => a + 5)}>
          + 5
        </button>
      </div>
      <p style={{ margin: 0, fontSize: '0.85rem' }}>
        Both cards are the same <code>PriceTag</code> component — only the props differ.
      </p>
    </>
  );
}

export default function Props() {
  return (
    <article>
      <PageHeader topic={topic}>
        Props ("properties") are how a parent component passes data down to a child —
        read-only, one direction, just like arguments to a function.
      </PageHeader>

      <p>
        Every component receives a single object argument, conventionally destructured
        in the function signature. The parent decides what to pass; the child just reads
        it. A child can never modify its own props — that's what makes data flow in
        React predictable: always parent → child.
      </p>

      <CodeBlock
        title="Passing and reading props"
        code={`function PriceTag({ label, amount, currency = '$' }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{currency}{amount}</strong>
    </div>
  );
}

// parent passes different props to the same component
<PriceTag label="Plan A" amount={42} />
<PriceTag label="Plan B" amount={84} currency="€" />`}
      />

      <Callout type="tip" title="Default values">
        <code>{'{ currency = \'$\' }'}</code> is a default parameter — if the parent
        doesn't pass <code>currency</code>, it falls back to <code>'$'</code>. This is
        plain JavaScript destructuring, nothing React-specific.
      </Callout>

      <h2>Props are read-only</h2>
      <p>
        If <code>PriceTag</code> tried to do <code>amount = 0</code> inside its body,
        React would still re-render it with whatever the parent passes next — the child's
        local mutation would just be overwritten. This is intentional: it's what makes a
        component's output predictable purely from its props (and state).{' '}
        Need to change a value the child displays? Lift that value into state in the
        parent, and pass down both the value and a function to update it — you'll see
        exactly that pattern in <em>Lifting State Up</em>.
      </p>

      <h2>Try it</h2>
      <p>
        The buttons live in the parent and update a piece of state; that state flows
        down into both <code>PriceTag</code> cards as the <code>amount</code> prop.
      </p>
      <DemoCard
        label="Same component, different props"
        code={`function PropsDemo() {
  const [amount, setAmount] = useState(42);
  return (
    <>
      <PriceTag label="Plan A" amount={amount} />
      <PriceTag label="Plan B" amount={amount * 2} currency="€" />

      <button onClick={() => setAmount((a) => Math.max(0, a - 5))}>− 5</button>
      <button onClick={() => setAmount((a) => a + 5)}>+ 5</button>
    </>
  );
}`}
      >
        <PropsDemo />
      </DemoCard>

      <h2>What actually happens when you click &ldquo;+ 5&rdquo;</h2>
      <StepThrough
        title="Tracing one click of the + 5 button"
        steps={[
          {
            icon: '👆',
            label: 'Click',
            explain: 'You click "+5", which calls setAmount(a => a + 5) in the parent, PropsDemo.',
            preview: 'amount update scheduled',
          },
          {
            icon: '🔁',
            label: 'Parent re-runs',
            explain: 'React re-runs PropsDemo. amount is now 5 higher — this value lives only in the parent, never in PriceTag.',
            preview: 'amount === 47',
          },
          {
            icon: '📦',
            label: 'Props recomputed',
            explain: 'Each <PriceTag amount={...} /> call passes a fresh value: Plan A gets amount, Plan B gets amount * 2.',
            preview: 'Plan A → amount=47, Plan B → amount=94',
          },
          {
            icon: '🧩',
            label: 'Children re-render',
            explain: 'Both PriceTag calls re-run with their new props. Neither PriceTag has any state of its own — it just displays whatever it was handed.',
            preview: 'PriceTag(props) runs twice',
          },
          {
            icon: '🖥️',
            label: 'Commit',
            explain: 'React updates only the two text nodes that actually changed — both cards update together because they both derive from the one parent value.',
            preview: 'both cards show new numbers',
          },
        ]}
      />

      <Quiz
        question="After clicking + 5, which component's state actually changed?"
        options={[
          "Plan A's PriceTag component",
          'PropsDemo, the parent — PriceTag has no state of its own',
          "Both PriceTag components, independently",
        ]}
        correctIndex={1}
        explanation="amount lives in PropsDemo via useState; both PriceTag cards are plain, stateless functions that just render whatever amount prop they're handed that render."
      />
      <Quiz
        question="Plan B shows amount * 2 and a different currency. Where does that logic live?"
        options={[
          "Inside PriceTag, which checks which plan it is",
          "In the parent, PropsDemo — it computes amount * 2 and passes currency='€' as the props for that specific PriceTag call",
          'In a global variable shared by both cards',
        ]}
        correctIndex={1}
        explanation="PriceTag is generic and doesn't know about 'Plan B' at all — the parent decides what data each instance gets, which is exactly what makes the same component reusable for different cards."
      />

      <RealWorld title="One Button component, every button on the site">
        <p>
          Nearly every design system (Stripe, Shopify's Polaris, your own company's app)
          has one <code>Button</code> component whose look changes entirely through
          props — a <code>variant</code> for color, a <code>size</code>, a{' '}
          <code>disabled</code> flag — instead of dozens of near-duplicate button
          components.
        </p>
        <CodeBlock
          title="Button.jsx"
          code={`function Button({ variant = 'primary', size = 'md', children, ...rest }) {
  return (
    <button className={\`btn btn-\${variant} btn-\${size}\`} {...rest}>
      {children}
    </button>
  );
}

<Button variant="danger" size="sm" onClick={deleteAccount}>
  Delete account
</Button>`}
        />
      </RealWorld>

      <Quiz
        question="A child component wants to change a value it received as a prop. What should it do?"
        options={[
          'Reassign the prop variable directly inside the component',
          'Ask the parent to own that value as state and pass down an updater function',
          'Use document.querySelector to change the DOM directly',
        ]}
        correctIndex={1}
        explanation="props flow one way (parent → child); a child that needs to change a value asks its parent, usually via a callback prop, to update state that then flows back down."
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
