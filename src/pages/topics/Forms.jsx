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
      <DemoCard
        label="A controlled, validated form"
        code={`function SignupDemo() {
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('free');
  const [submitted, setSubmitted] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted({ email, plan });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <select value={plan} onChange={(e) => setPlan(e.target.value)}>
        <option value="free">Free</option>
        <option value="pro">Pro</option>
      </select>
      <button type="submit">Sign up</button>
    </form>
  );
}`}
      >
        <SignupDemo />
      </DemoCard>

      <h2>What actually happens when you submit</h2>
      <StepThrough
        title="Tracing a click on 'Sign up'"
        steps={[
          {
            icon: '⌨️',
            label: 'Type',
            explain: 'Each keystroke in the email field fires onChange, calling setEmail — the input\'s value prop always mirrors that state.',
            preview: 'email === "you@example.com"',
          },
          {
            icon: '👆',
            label: 'Submit clicked',
            explain: 'Clicking "Sign up" fires the form\'s onSubmit, which by default would reload the page — that\'s why handleSubmit\'s first line is e.preventDefault().',
            preview: 'page reload cancelled',
          },
          {
            icon: '📸',
            label: 'Snapshot taken',
            explain: 'handleSubmit calls setSubmitted({ email, plan }) — reading the current email and plan state at the moment of submission.',
            preview: 'submitted update scheduled',
          },
          {
            icon: '🔁',
            label: 'Re-run',
            explain: 'React re-runs SignupDemo. submitted is no longer null, so the confirmation branch of the JSX now renders.',
            preview: 'submitted !== null',
          },
          {
            icon: '🖥️',
            label: 'Commit',
            explain: 'React adds the confirmation paragraph to the DOM — the form itself stays exactly as it was, since email and plan didn\'t change.',
            preview: '"✅ Would submit: you@example.com on the free plan."',
          },
        ]}
      />

      <Quiz
        question="What happens if handleSubmit omits e.preventDefault()?"
        options={[
          'Nothing changes, it\'s optional',
          'The browser performs its default full-page form submission and reload, discarding all React state',
          'setSubmitted simply runs twice instead of once',
        ]}
        correctIndex={1}
        explanation="an HTML form's default behavior is to navigate/reload on submit — preventDefault() is what lets your JavaScript handler own the submission instead."
      />
      <Quiz
        question="Why is the <select> for plan also 'controlled', using value={plan} and onChange, instead of just reading it on submit?"
        options={[
          '<select> elements cannot be read without being controlled',
          "It keeps plan as a single source of truth the whole component can react to at any time (e.g. to disable options, show a live preview), not just at submission",
          'It has no real benefit, it is purely stylistic',
        ]}
        correctIndex={1}
        explanation="controlling every field the same way means the component always knows the current value of the whole form, which is what makes live validation, conditional fields, and previews possible without extra plumbing."
      />

      <RealWorld title="A login form with inline validation">
        <p>
          Real login forms track an <code>errors</code> object alongside each field's
          value, and only show a message once the user has actually interacted with a
          field — the same controlled-input pattern, with a bit more state to describe
          "is this field valid, and should we say so yet."
        </p>
        <CodeBlock
          title="LoginForm.jsx"
          code={`function LoginForm() {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const isValid = /\\S+@\\S+\\.\\S+/.test(email);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setTouched(true)}
      />
      {touched && !isValid && <p className="error">Enter a valid email</p>}
      <button disabled={!isValid}>Log in</button>
    </form>
  );
}`}
        />
      </RealWorld>

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
