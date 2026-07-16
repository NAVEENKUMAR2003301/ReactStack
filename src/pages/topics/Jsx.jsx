import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavFooter from '../../components/PageNavFooter';
import CodeBlock from '../../components/CodeBlock';
import DemoCard from '../../components/DemoCard';
import Callout from '../../components/Callout';
import FlowDiagram from '../../components/FlowDiagram';
import RealWorld from '../../components/RealWorld';
import Quiz from '../../components/Quiz';
import { TOPICS } from '../../data/topics';

const topic = TOPICS.find((t) => t.slug === 'jsx');

function GreetingDemo() {
  const [name, setName] = useState('friend');
  const isLongName = name.length > 8;

  return (
    <>
      <input
        className="input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type a name…"
        aria-label="Name"
      />
      <h3 style={{ margin: 0 }}>
        Hello, {name || 'stranger'}! {isLongName && '👋 nice long name'}
      </h3>
      <p style={{ margin: 0, fontSize: '0.85rem' }}>
        This whole block is JSX: an expression <code>{'{name}'}</code> and a conditional
        <code>{' {isLongName && ...}'}</code> mixed directly into markup.
      </p>
    </>
  );
}

export default function Jsx() {
  return (
    <article>
      <PageHeader topic={topic}>
        React lets you describe UI with JSX — HTML-like syntax that compiles down to
        plain JavaScript function calls. Understanding that one fact demystifies almost
        everything else.
      </PageHeader>

      <p>
        Traditionally, web development kept structure (HTML), style (CSS), and behavior
        (JavaScript) in separate files. React's insight was that <strong>markup and the
        logic that produces it are so tightly coupled</strong> — a list re-orders when
        data changes, a button's label depends on state — that separating them by file
        type creates more friction than it removes. So React puts them in the same place:
        a <strong>component</strong>, written in JSX.
      </p>

      <FlowDiagram
        steps={[
          { icon: '📝', label: 'You write JSX' },
          { icon: '⚙️', label: 'Babel compiles it' },
          { icon: '🧩', label: 'React.createElement() calls' },
          { icon: '🌳', label: 'A tree of JS objects' },
          { icon: '🖥️', label: 'Rendered to the DOM' },
        ]}
      />

      <h2>JSX is just JavaScript in disguise</h2>
      <p>
        This JSX on the left and the JavaScript on the right produce the exact same
        result — JSX is <em>syntax sugar</em> for nested function calls.
      </p>
      <CodeBlock
        title="JSX → JavaScript"
        code={`function Welcome() {
  return <h1 className="title">Hello!</h1>;
}

// is compiled to:
function Welcome() {
  return React.createElement(
    'h1',
    { className: 'title' },
    'Hello!'
  );
}`}
      />

      <Callout type="tip" title="Why this matters">
        Because JSX compiles to function calls, you can use real JavaScript inside it —
        variables, ternaries, <code>.map()</code>, function calls — anywhere you'd
        normally write a value. Curly braces <code>{'{ }'}</code> are the escape hatch
        from markup back into JavaScript.
      </Callout>

      <h2>Rules that make JSX valid</h2>
      <ul>
        <li>Return a <strong>single root element</strong> (or a fragment <code>&lt;&gt;...&lt;/&gt;</code>).</li>
        <li>Close every tag, including self-closing ones: <code>&lt;img /&gt;</code>.</li>
        <li>Use <code>className</code> instead of <code>class</code>, and <code>htmlFor</code> instead of <code>for</code> — they're JavaScript property names, not HTML attributes.</li>
        <li>Any JavaScript expression can go inside <code>{'{ }'}</code> — statements like <code>if</code> or <code>for</code> cannot.</li>
      </ul>

      <h2>Try it</h2>
      <p>Edit the name below and watch the JSX expression re-evaluate on every keystroke.</p>
      <DemoCard
        label="Interactive JSX"
        code={`function GreetingDemo() {
  const [name, setName] = useState('friend');
  const isLongName = name.length > 8;

  return (
    <>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type a name…"
      />
      <h3>
        Hello, {name || 'stranger'}! {isLongName && '👋 nice long name'}
      </h3>
    </>
  );
}`}
      >
        <GreetingDemo />
      </DemoCard>

      <RealWorld title="Product cards on a shopping site">
        <p>
          Every product card on a site like Amazon mixes markup with live data the same
          way: a title, a price formatted from a number, a "Sold out" badge that only
          shows up sometimes, and a star rating built from a loop. None of that needs a
          separate templating language — it's the same JSX and curly-brace expressions
          you just saw, just with real data in place of a name.
        </p>
        <CodeBlock
          title="ProductCard.jsx"
          code={`function ProductCard({ product }) {
  const { name, price, rating, inStock } = product;

  return (
    <div className="product-card">
      <h3>{name}</h3>
      <p>\${price.toFixed(2)}</p>
      {!inStock && <span className="badge">Sold out</span>}
      <p>{'⭐'.repeat(Math.round(rating))}</p>
    </div>
  );
}`}
        />
      </RealWorld>

      <Quiz
        question="Which of these is valid JSX?"
        options={[
          'return <h1>Hi</h1><p>Bye</p>;',
          'return <><h1>Hi</h1><p>Bye</p></>;',
          'return if (ready) { <h1>Hi</h1> };',
        ]}
        correctIndex={1}
        explanation="a component must return one root node, so two siblings need to be wrapped — a fragment (<>...</>) is the lightest wrapper, since if/for statements aren't allowed inside curly braces."
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
