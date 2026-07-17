import { createContext, useContext, useState } from 'react';
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

const topic = TOPICS.find((t) => t.slug === 'context');

const AccentContext = createContext('purple');

function DeepButton() {
  const accent = useContext(AccentContext);
  const colors = { purple: '#7c3aed', pink: '#db2777', teal: '#0d9488' };
  return (
    <button
      className="btn"
      style={{ borderColor: colors[accent], color: colors[accent] }}
    >
      I read context, 3 levels deep
    </button>
  );
}
function MiddleWrapper() {
  return (
    <div style={{ border: '1px dashed var(--border-strong)', padding: 12, borderRadius: 8 }}>
      <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)', margin: '0 0 8px' }}>
        Middle component — never touches "accent"
      </p>
      <DeepButton />
    </div>
  );
}

function ContextDemo() {
  const [accent, setAccent] = useState('purple');
  return (
    <AccentContext.Provider value={accent}>
      <div className="btn-row">
        {['purple', 'pink', 'teal'].map((c) => (
          <button key={c} className="btn btn--sm" onClick={() => setAccent(c)}>
            {c}
          </button>
        ))}
      </div>
      <MiddleWrapper />
    </AccentContext.Provider>
  );
}

export default function ContextTopic() {
  return (
    <article>
      <PageHeader topic={topic}>
        Context lets a value skip past every intermediate component and be read directly
        by any descendant — solving "prop drilling" through components that don't care
        about that value.
      </PageHeader>

      <p>
        Passing data down five levels of props, where three of those levels only forward
        it without using it, is called <strong>prop drilling</strong>. Context fixes this:
        wrap a subtree in a <code>Provider</code> with a value, and any descendant can
        call <code>useContext</code> to read it directly — no matter how deep.
      </p>

      <CodeBlock
        title="Creating, providing, and consuming context"
        code={`const AccentContext = createContext('purple');

function App() {
  const [accent, setAccent] = useState('purple');
  return (
    <AccentContext.Provider value={accent}>
      <MiddleWrapper /> {/* doesn't touch accent at all */}
    </AccentContext.Provider>
  );
}

function DeepButton() {
  const accent = useContext(AccentContext); // reads it directly
  return <button style={{ color: accent }}>Themed</button>;
}`}
      />

      <FlowDiagram
        steps={[
          { icon: '📦', label: 'Provider sets value' },
          { icon: '➡️', label: 'MiddleWrapper (skipped)' },
          { icon: '🎯', label: 'DeepButton reads it directly' },
        ]}
      />

      <Callout type="warn" title="Context is not a global state manager">
        Context is great for values that are truly "ambient" to a subtree — theme,
        current user, locale. It's not a replacement for well-designed local state: every
        component that reads a context re-renders whenever that context's value changes,
        so cramming fast-changing, unrelated data into one big context can cause
        unnecessary re-renders across your app.
      </Callout>

      <h2>Try it</h2>
      <p>
        <code>MiddleWrapper</code> never receives or forwards an <code>accent</code> prop
        — <code>DeepButton</code> reads it straight from context.
      </p>
      <DemoCard
        label="Context skipping a level"
        code={`const AccentContext = createContext('purple');

function DeepButton() {
  const accent = useContext(AccentContext);
  return <button style={{ color: accent }}>I read context, 3 levels deep</button>;
}

function MiddleWrapper() {
  return <DeepButton />; // never touches "accent" at all
}

function ContextDemo() {
  const [accent, setAccent] = useState('purple');
  return (
    <AccentContext.Provider value={accent}>
      <button onClick={() => setAccent('pink')}>pink</button>
      <MiddleWrapper />
    </AccentContext.Provider>
  );
}`}
      >
        <ContextDemo />
      </DemoCard>

      <h2>What actually happens when you click &ldquo;pink&rdquo;</h2>
      <StepThrough
        title="Tracing one click of the 'pink' button"
        steps={[
          {
            icon: '👆',
            label: 'Click',
            explain: 'You click "pink", which calls setAccent(\'pink\') in ContextDemo.',
            preview: 'accent update scheduled',
          },
          {
            icon: '🔁',
            label: 'Provider re-runs',
            explain: 'React re-runs ContextDemo. It renders <AccentContext.Provider value="pink">, a new value for the context.',
            preview: 'Provider value === "pink"',
          },
          {
            icon: '➡️',
            label: 'MiddleWrapper re-renders',
            explain: 'MiddleWrapper re-renders too, as any child of a re-rendering parent normally does — but it never reads useContext(AccentContext), so it has no idea the value changed.',
            preview: 'MiddleWrapper() runs, ignores accent entirely',
          },
          {
            icon: '🎯',
            label: 'DeepButton reads context',
            explain: 'DeepButton calls useContext(AccentContext) directly. Because the Provider above it now has value="pink", that call returns "pink" — no matter how many components sit in between.',
            preview: 'accent === "pink" inside DeepButton',
          },
          {
            icon: '🖥️',
            label: 'Commit',
            explain: 'Only DeepButton\'s border/text color actually changes on screen — the update reached it directly through context, not by being passed down through MiddleWrapper.',
            preview: 'button turns pink',
          },
        ]}
      />

      <Quiz
        question="Does MiddleWrapper need to change at all when a new context value, like 'teal', is introduced later?"
        options={[
          "Yes, it must be updated to accept and forward the new value",
          "No — MiddleWrapper never touches AccentContext, so it's completely unaffected by adding new possible values",
          "Yes, every component in the tree must call useContext",
        ]}
        correctIndex={1}
        explanation="that's the payoff of context: components that don't care about a value are never coupled to it, so they don't need to change when that value's possibilities change."
      />
      <Quiz
        question="If DeepButton were rendered outside of any AccentContext.Provider, what value would useContext(AccentContext) return?"
        options={[
          "undefined, always",
          "The default value passed to createContext('purple') — 'purple' in this case",
          "It would throw an error",
        ]}
        correctIndex={1}
        explanation="createContext(defaultValue) supplies a fallback for exactly this situation — any consumer with no matching Provider above it in the tree receives that default instead of erroring."
      />

      <RealWorld title="Knowing who's logged in, anywhere in the app">
        <p>
          The most common real context is <strong>auth</strong>: an{' '}
          <code>AuthContext</code> set once near the root, holding the current user.
          A checkout button 10 components deep, a settings page, and the navbar avatar
          can all read the same <code>user</code> without any of the components between
          them needing to know it exists — this is exactly how ReactStack's own dark/light
          theme works, too.
        </p>
        <CodeBlock
          title="AuthContext.jsx"
          code={`const AuthContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={user}>
      <Navbar />
      <Routes>{/* ... */}</Routes>
    </AuthContext.Provider>
  );
}

function CheckoutButton() {
  const user = useContext(AuthContext);
  return user ? <button>Pay now</button> : <button>Log in to pay</button>;
}`}
        />
      </RealWorld>

      <Quiz
        question="Why use Context instead of just passing accent as a prop through MiddleWrapper?"
        options={[
          "Context is always faster than passing props",
          "MiddleWrapper doesn't use accent at all — forcing it to accept and forward the prop couples it to a concern it doesn't have",
          "Props can only be passed one level deep in React",
        ]}
        correctIndex={1}
        explanation="prop drilling forces every intermediate component to know about and forward data it doesn't use, coupling unrelated components together — context lets the one component that actually needs the value read it directly."
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
