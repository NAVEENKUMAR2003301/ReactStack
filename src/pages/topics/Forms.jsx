import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavFooter from '../../components/PageNavFooter';
import CodeBlock from '../../components/CodeBlock';
import DemoCard from '../../components/DemoCard';
import Callout from '../../components/Callout';
import Quiz from '../../components/Quiz';
import { TOPICS } from '../../data/topics';

const topic = TOPICS.find((t) => t.slug === 'forms');

function SignupDemo() {
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('free');
  const [submitted, setSubmitted] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted({ email, plan });
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 320, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>
        Email
        <input
          className="input"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={{ display: 'block', marginTop: 4, maxWidth: '100%' }}
        />
      </label>
      <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>
        Plan
        <select
          className="input"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          style={{ display: 'block', marginTop: 4, maxWidth: '100%' }}
        >
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </select>
      </label>
      <button className="btn btn--primary" type="submit">Sign up</button>
      {submitted && (
        <p style={{ fontSize: '0.82rem', margin: 0 }}>
          ✅ Would submit: <code>{submitted.email || '(empty)'}</code> on the{' '}
          <code>{submitted.plan}</code> plan.
        </p>
      )}
    </form>
  );
}

export default function Forms() {
  return (
    <article>
      <PageHeader topic={topic}>
        A controlled input's value always comes from state, and every keystroke updates
        that state — making state the single source of truth for what's on screen.
      </PageHeader>

      <CodeBlock
        title="A controlled input"
        code={`function EmailField() {
  const [email, setEmail] = useState('');

  return (
    <input
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  );
}`}
      />

      <h2>Controlled vs. uncontrolled</h2>
      <p>
        With a <strong>controlled</strong> input, React sets the displayed value on every
        render (<code>value={'{email}'}</code>) and <code>onChange</code> is the only way
        it changes — the DOM input is a pure reflection of state. An{' '}
        <strong>uncontrolled</strong> input lets the DOM keep its own value, and you read
        it on demand with a ref. Controlled inputs are the default in React because they
        let you validate, format, or disable submission based on the current value at any
        time — the state <em>is</em> the value, so there's nothing to synchronize.
      </p>

      <Callout type="tip" title="Always preventDefault() on submit">
        By default, submitting an HTML form reloads the page.{' '}
        <code>{"onSubmit={(e) => e.preventDefault()}"}</code> stops that, so your handler
        can run its own submission logic (validation, an API call, updating state) instead.
      </Callout>

      <h2>Try it</h2>
      <DemoCard label="A controlled, validated form">
        <SignupDemo />
      </DemoCard>

      <Quiz
        question="In a controlled <input value={email} onChange={...} />, what actually makes the characters you type appear?"
        options={[
          'The browser updates the DOM input value automatically, like any input',
          'onChange updates state, and React re-renders the input with the new state as its value',
          'React watches the DOM for changes and copies them into state automatically',
        ]}
        correctIndex={1}
        explanation="typing fires onChange, which calls setEmail — that state change triggers a re-render, and the input's value prop is set to the new state, which is why it looks like typing 'just worked'."
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
