import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import PageNavFooter from '../../components/PageNavFooter';
import CodeBlock from '../../components/CodeBlock';
import DemoCard from '../../components/DemoCard';
import Callout from '../../components/Callout';
import Quiz from '../../components/Quiz';
import { TOPICS } from '../../data/topics';

const topic = TOPICS.find((t) => t.slug === 'conditional-rendering');

function InboxDemo() {
  const [count, setCount] = useState(3);
  const [loggedIn, setLoggedIn] = useState(true);

  return (
    <>
      <div className="btn-row">
        <button className="btn btn--sm" onClick={() => setLoggedIn((v) => !v)}>
          Toggle login: {loggedIn ? 'in' : 'out'}
        </button>
        <button className="btn btn--sm" onClick={() => setCount((c) => Math.max(0, c - 1))}>
          Read one
        </button>
        <button className="btn btn--sm" onClick={() => setCount((c) => c + 1)}>
          New message
        </button>
      </div>
      <div className="card" style={{ width: '100%' }}>
        {!loggedIn ? (
          <p style={{ margin: 0 }}>Please log in to see your inbox.</p>
        ) : count === 0 ? (
          <p style={{ margin: 0 }}>📭 Inbox zero — nice work.</p>
        ) : (
          <p style={{ margin: 0 }}>
            📬 You have <strong>{count}</strong> unread message{count !== 1 && 's'}
            {count > 5 && ' — that\'s a lot!'}
          </p>
        )}
      </div>
    </>
  );
}

export default function ConditionalRendering() {
  return (
    <article>
      <PageHeader topic={topic}>
        Because JSX is JavaScript, showing different UI for different states is just
        JavaScript control flow — if/else, ternaries, and &&, chosen by readability.
      </PageHeader>

      <h2>Three common patterns</h2>
      <CodeBlock
        title="if / else — full early return"
        code={`function Inbox({ loggedIn }) {
  if (!loggedIn) {
    return <p>Please log in.</p>;
  }
  return <p>Welcome back!</p>;
}`}
      />
      <CodeBlock
        title="ternary — inline, either/or"
        code={`<p>{loggedIn ? 'Welcome back!' : 'Please log in.'}</p>`}
      />
      <CodeBlock
        title="&& — render something, or nothing"
        code={`<p>
  {unreadCount > 0 && \`You have \${unreadCount} unread\`}
</p>`}
      />

      <Callout type="warn" title='The "0 renders as 0" trap'>
        <code>{'{count && <Badge />}'}</code> looks safe, but when <code>count</code> is{' '}
        <code>0</code>, <code>0 && anything</code> evaluates to <code>0</code> —{' '}
        <strong>and React renders that 0 as literal text.</strong> Fix it by making the
        left side an actual boolean: <code>{'{count > 0 && <Badge />}'}</code>.
      </Callout>

      <h2>Choosing between them</h2>
      <ul>
        <li>Two full, different JSX trees → early <code>return</code> or a ternary.</li>
        <li>Render something or nothing → <code>&&</code> (with a real boolean on the left).</li>
        <li>Three or more branches → a ternary chain gets unreadable fast; prefer an early return or a lookup object.</li>
      </ul>

      <h2>Try it</h2>
      <DemoCard label="Three conditions layered together">
        <InboxDemo />
      </DemoCard>

      <Quiz
        question='What does <p>{0 && "You have unread mail"}</p> render when the count is 0?'
        options={[
          'Nothing is rendered',
          'The literal text "0"',
          'A console error is thrown',
        ]}
        correctIndex={1}
        explanation='"0 && ..." short-circuits to 0 (a valid, falsy-but-renderable JSX child), so React prints it as text — the fix is "count > 0 && ..." so the left side is always a real boolean.'
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
