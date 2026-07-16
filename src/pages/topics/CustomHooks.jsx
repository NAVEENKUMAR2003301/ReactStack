import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavFooter from '../../components/PageNavFooter';
import CodeBlock from '../../components/CodeBlock';
import DemoCard from '../../components/DemoCard';
import Callout from '../../components/Callout';
import Quiz from '../../components/Quiz';
import { TOPICS } from '../../data/topics';

const topic = TOPICS.find((t) => t.slug === 'custom-hooks');

function useOnlineStatus() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);
  return online;
}

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window === 'undefined' ? 0 : window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}

function CustomHooksDemo() {
  const online = useOnlineStatus();
  const width = useWindowWidth();

  return (
    <div className="btn-row">
      <div className="card">
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>useOnlineStatus()</div>
        <div style={{ fontWeight: 700 }}>{online ? '🟢 Online' : '🔴 Offline'}</div>
      </div>
      <div className="card">
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>useWindowWidth()</div>
        <div style={{ fontWeight: 700 }}>{width}px — try resizing</div>
      </div>
    </div>
  );
}

export default function CustomHooks() {
  return (
    <article>
      <PageHeader topic={topic}>
        A custom hook is just a function whose name starts with "use" and that calls
        other hooks inside it — the way you extract and reuse stateful logic.
      </PageHeader>

      <p>
        Two unrelated components might both need to know if the browser is online, or
        how wide the window currently is. Copy-pasting the same{' '}
        <code>useState</code> + <code>useEffect</code> pair into both is how logic drifts
        out of sync over time. A custom hook extracts that logic once, and any component
        can call it to get the same behavior.
      </p>

      <CodeBlock
        title="Extracting a custom hook"
        code={`function useOnlineStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return online;
}

// any component can now do:
function StatusBadge() {
  const online = useOnlineStatus();
  return <span>{online ? '🟢' : '🔴'}</span>;
}`}
      />

      <Callout type="why" title="Why the 'use' prefix isn't just a convention">
        React relies on hooks being called in the exact same order on every render to
        match each <code>useState</code> call to its stored value. The "use" prefix lets
        both the linter and other developers recognize "this function calls hooks
        internally" — so they know not to call it conditionally, inside a loop, or after
        an early return, which would break that ordering.
      </Callout>

      <h2>What makes something worth extracting</h2>
      <ul>
        <li>The same <code>useState</code>/<code>useEffect</code> pairing shows up in two or more components.</li>
        <li>A piece of logic — polling, subscriptions, form validation — is complex enough to deserve a name and, ideally, its own tests.</li>
        <li>You want to swap an implementation later (e.g. localStorage → a server) without touching every component that uses it.</li>
      </ul>

      <h2>Try it</h2>
      <p>Both live values below come from custom hooks — resize your window or toggle your network connection to see them update.</p>
      <DemoCard label="Two custom hooks in use">
        <CustomHooksDemo />
      </DemoCard>

      <Quiz
        question="Can a custom hook call other hooks like useState and useEffect inside it?"
        options={[
          "No, only components can call hooks",
          "Yes — that's the entire point; a custom hook is a function that composes other hooks",
          "Only if the custom hook is defined inside the component that uses it",
        ]}
        correctIndex={1}
        explanation="a custom hook is nothing more than a regular JavaScript function, named with a 'use' prefix, that's allowed to call other hooks — that composability is what lets it bundle stateful logic for reuse."
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
