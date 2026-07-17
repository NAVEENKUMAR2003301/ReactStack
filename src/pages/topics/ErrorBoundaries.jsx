import { Component, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavFooter from '../../components/PageNavFooter';
import CodeBlock from '../../components/CodeBlock';
import DemoCard from '../../components/DemoCard';
import StepThrough from '../../components/StepThrough';
import Callout from '../../components/Callout';
import RealWorld from '../../components/RealWorld';
import Quiz from '../../components/Quiz';
import { TOPICS } from '../../data/topics';

const topic = TOPICS.find((t) => t.slug === 'error-boundaries');

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="card" style={{ borderColor: 'var(--danger)', background: 'var(--danger-soft)', color: 'var(--danger)' }}>
          <strong>Something went wrong in this widget.</strong>
          <p style={{ margin: '6px 0 0' }}>The rest of the page is unaffected.</p>
          <button className="btn btn--sm" style={{ marginTop: 8 }} onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function BuggyWidget({ crash }) {
  if (crash) {
    throw new Error('Simulated render crash');
  }
  return <div className="card">✅ Widget rendering fine.</div>;
}

function ErrorBoundaryDemo() {
  const [crash, setCrash] = useState(false);
  return (
    <>
      <button className="btn btn--primary" onClick={() => setCrash(true)}>
        💥 Trigger a render crash
      </button>
      <ErrorBoundary key={crash}>
        <BuggyWidget crash={crash} />
      </ErrorBoundary>
    </>
  );
}

export default function ErrorBoundaries() {
  return (
    <article>
      <PageHeader topic={topic}>
        An error boundary is a component that catches JavaScript errors thrown during
        rendering in its children, logs them, and shows a fallback UI instead of a blank
        crashed page.
      </PageHeader>

      <p>
        By default, an uncaught error anywhere in the render tree unmounts the{' '}
        <strong>entire</strong> React app — one broken widget takes down the whole page.
        Error boundaries contain the blast radius: wrap a risky subtree, and if it
        throws, only that subtree is replaced with a fallback, while the rest of the app
        keeps working.
      </p>

      <CodeBlock
        title="A minimal error boundary"
        code={`class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <p>Something went wrong.</p>;
    }
    return this.props.children;
  }
}

<ErrorBoundary>
  <RiskyWidget />
</ErrorBoundary>`}
      />

      <Callout type="warn" title="Error boundaries must be class components">
        As of today, only class components can be error boundaries — there is no{' '}
        <code>useErrorBoundary</code> hook, because the underlying lifecycle method,{' '}
        <code>getDerivedStateFromError</code>, has no hook equivalent. In practice, most
        teams write this one class once and reuse it everywhere, rather than writing
        classes elsewhere in the app.
      </Callout>

      <h2>What they do and don't catch</h2>
      <ul>
        <li>✅ Errors thrown while rendering a component.</li>
        <li>✅ Errors in lifecycle methods and constructors of the tree below them.</li>
        <li>❌ Errors inside event handlers (use a regular try/catch there).</li>
        <li>❌ Errors in asynchronous code (setTimeout, fetch callbacks) — again, try/catch.</li>
      </ul>

      <h2>Try it</h2>
      <DemoCard
        label="A contained crash"
        code={`function BuggyWidget({ crash }) {
  if (crash) throw new Error('Simulated render crash');
  return <div>✅ Widget rendering fine.</div>;
}

function ErrorBoundaryDemo() {
  const [crash, setCrash] = useState(false);
  return (
    <>
      <button onClick={() => setCrash(true)}>💥 Trigger a render crash</button>
      <ErrorBoundary key={crash}>
        <BuggyWidget crash={crash} />
      </ErrorBoundary>
    </>
  );
}`}
      >
        <ErrorBoundaryDemo />
      </DemoCard>

      <h2>What actually happens when you trigger the crash</h2>
      <StepThrough
        title="Tracing a caught render error"
        steps={[
          {
            icon: '👆',
            label: 'Click',
            explain: 'You click "💥 Trigger a render crash", which calls setCrash(true).',
            preview: 'crash update scheduled',
          },
          {
            icon: '🔁',
            label: 'Re-render',
            explain: 'React re-renders ErrorBoundaryDemo, and BuggyWidget receives crash={true} as its new prop.',
            preview: 'BuggyWidget({ crash: true })',
          },
          {
            icon: '💥',
            label: 'Throw',
            explain: 'While rendering, BuggyWidget hits if (crash) { throw new Error(...) } — an actual JavaScript error thrown mid-render, not caught by any try/catch here.',
            preview: 'Error thrown during render',
          },
          {
            icon: '🛡️',
            label: 'Boundary catches it',
            explain: 'React unwinds up the tree looking for the nearest error boundary. ErrorBoundary.getDerivedStateFromError() runs, returning { hasError: true }.',
            preview: 'ErrorBoundary.state.hasError === true',
          },
          {
            icon: '🖥️',
            label: 'Fallback commits',
            explain: 'ErrorBoundary re-renders its fallback card instead of the crashed BuggyWidget — everything outside the boundary is completely unaffected.',
            preview: '"Something went wrong in this widget." shown',
          },
        ]}
      />

      <Quiz
        question="What exactly does ErrorBoundary catch in this demo?"
        options={[
          "Any error anywhere in the whole app, including button click handlers",
          "An error thrown specifically while BuggyWidget was rendering, inside the boundary's own subtree",
          "Network errors from any fetch() call on the page",
        ]}
        correctIndex={1}
        explanation="error boundaries only catch errors thrown during the render of their children — this demo's throw happens directly inside BuggyWidget's render, which is exactly the case they're built for."
      />
      <Quiz
        question="If the crash were triggered by an onClick handler throwing, instead of happening during render, would this ErrorBoundary catch it?"
        options={[
          "Yes, boundaries catch everything below them regardless of when it happens",
          "No — click handlers run outside of React's render process, so a boundary never sees that error; it needs a manual try/catch instead",
          "Only if the handler also calls setState",
        ]}
        correctIndex={1}
        explanation="error boundaries hook specifically into the render lifecycle — an error inside a callback like onClick happens later, well after any render call has returned, so React has no hook there to intercept it."
      />

      <RealWorld title="A broken chart widget shouldn't take down the dashboard">
        <p>
          A dashboard often embeds several independent widgets — a chart library, a map,
          a third-party embed — any of which can throw on bad data. Wrapping each widget
          in its own error boundary means one broken chart shows a small "couldn't load"
          message while the rest of the dashboard keeps working normally.
        </p>
        <CodeBlock
          title="Dashboard.jsx"
          code={`function Dashboard() {
  return (
    <div className="widget-grid">
      <ErrorBoundary><RevenueChart /></ErrorBoundary>
      <ErrorBoundary><UserMap /></ErrorBoundary>
      <ErrorBoundary><ActivityFeed /></ErrorBoundary>
    </div>
  );
}`}
        />
      </RealWorld>

      <Quiz
        question="A fetch() callback throws an error. Will a wrapping ErrorBoundary catch it?"
        options={[
          'Yes, error boundaries catch every kind of error anywhere below them',
          'No — error boundaries only catch errors thrown during rendering, not inside async callbacks',
          'Only if the fetch happens inside useEffect',
        ]}
        correctIndex={1}
        explanation="error boundaries hook into React's render process specifically — an error thrown later, inside an async callback, happens outside of any render call, so React never sees it; that needs a manual try/catch instead."
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
