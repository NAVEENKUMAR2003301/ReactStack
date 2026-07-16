import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavFooter from '../../components/PageNavFooter';
import CodeBlock from '../../components/CodeBlock';
import DemoCard from '../../components/DemoCard';
import Callout from '../../components/Callout';
import FlowDiagram from '../../components/FlowDiagram';
import RealWorld from '../../components/RealWorld';
import Quiz from '../../components/Quiz';
import { TOPICS } from '../../data/topics';

const topic = TOPICS.find((t) => t.slug === 'use-effect');

function ClockDemo() {
  const [running, setRunning] = useState(true);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <>
      <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--mono)', color: 'var(--heading)' }}>
        {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
      </div>
      <div className="btn-row">
        <button className="btn" onClick={() => setRunning((r) => !r)}>
          {running ? 'Pause' : 'Resume'}
        </button>
        <button className="btn" onClick={() => setSeconds(0)}>Reset</button>
      </div>
      <p style={{ margin: 0, fontSize: '0.82rem' }}>
        The interval starts in <code>useEffect</code> and is cleaned up (cleared) every
        time <code>running</code> changes or the component unmounts.
      </p>
    </>
  );
}

export default function UseEffect() {
  return (
    <article>
      <PageHeader topic={topic}>
        useEffect synchronizes a component with something outside of React — a timer, a
        subscription, the DOM, or a network request — running after the render commits.
      </PageHeader>

      <p>
        Rendering should be a pure calculation from props and state — no side effects.
        But real apps need side effects: fetching data, setting up a subscription,
        manually measuring the DOM. <code>useEffect</code> is the escape hatch: code
        inside it runs <em>after</em> React has updated the screen, not during render.
      </p>

      <CodeBlock
        title="The three parts of useEffect"
        code={`useEffect(() => {
  // 1. setup — runs after render, when deps change
  const id = setInterval(() => setSeconds(s => s + 1), 1000);

  // 2. cleanup — runs before the next effect, and on unmount
  return () => clearInterval(id);
}, [running]); // 3. dependencies — when to re-run`}
      />

      <FlowDiagram
        steps={[
          { icon: '🖥️', label: 'Render commits to DOM' },
          { icon: '🔍', label: 'React compares deps array' },
          { icon: '🧹', label: 'Runs previous cleanup (if changed)' },
          { icon: '▶️', label: 'Runs new effect' },
        ]}
      />

      <h2>Reading the dependency array</h2>
      <ul>
        <li><code>useEffect(fn)</code> — no array — runs after <strong>every</strong> render.</li>
        <li><code>useEffect(fn, [])</code> — empty array — runs <strong>once</strong>, after the first render.</li>
        <li><code>useEffect(fn, [a, b])</code> — runs after the first render, and again whenever <code>a</code> or <code>b</code> change.</li>
      </ul>

      <Callout type="warn" title="Every value the effect reads belongs in the array">
        If your effect reads <code>running</code> but you omit it from the dependency
        array, the effect keeps using the <code>running</code> value from whenever it was
        first created — a stale closure. The ESLint hook rules exist specifically to
        catch this; when in doubt, include everything the function body references.
      </Callout>

      <h2>Try it</h2>
      <p>
        Pause and resume — watch how the effect tears down the old interval and creates a
        fresh one each time <code>running</code> flips.
      </p>
      <DemoCard
        label="A synchronized timer"
        code={`function ClockDemo() {
  const [running, setRunning] = useState(true);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <>
      <div>{seconds}s</div>
      <button onClick={() => setRunning((r) => !r)}>
        {running ? 'Pause' : 'Resume'}
      </button>
      <button onClick={() => setSeconds(0)}>Reset</button>
    </>
  );
}`}
      >
        <ClockDemo />
      </DemoCard>

      <RealWorld title="Loading a user's profile when a page opens">
        <p>
          The single most common <code>useEffect</code> in real apps: fetch data when a
          component mounts (or when an id in the URL changes), track a loading flag, and
          clean up by ignoring the response if the component unmounts before it arrives.
        </p>
        <CodeBlock
          title="ProfilePage.jsx"
          code={`function ProfilePage({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    fetch(\`/api/users/\${userId}\`)
      .then((res) => res.json())
      .then((data) => { if (!ignore) { setUser(data); setLoading(false); } });

    return () => { ignore = true; }; // avoid setting state after unmount
  }, [userId]);

  if (loading) return <Spinner />;
  return <h1>{user.name}</h1>;
}`}
        />
      </RealWorld>

      <Quiz
        question="Why does useEffect return a cleanup function here (return () => clearInterval(id))?"
        options={[
          "It's optional styling, purely cosmetic",
          "To stop the old interval before a new one starts, preventing multiple timers stacking up",
          "Cleanup functions are required by JavaScript syntax rules",
        ]}
        correctIndex={1}
        explanation="without cleanup, every re-run of the effect would start another interval alongside the old ones still ticking — the returned function is React's way of undoing the effect before setting up the next one, or on unmount."
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
