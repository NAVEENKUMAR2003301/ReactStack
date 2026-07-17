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

const topic = TOPICS.find((t) => t.slug === 'events');

function EventDemo() {
  const [log, setLog] = useState([]);

  const push = (msg) => setLog((l) => [msg, ...l].slice(0, 4));

  return (
    <>
      <div className="btn-row">
        <button
          className="btn btn--primary"
          onClick={(e) => push(`Clicked at (${e.clientX}, ${e.clientY})`)}
        >
          Click me
        </button>
        <input
          className="input"
          placeholder="Type to log onChange…"
          onChange={(e) => push(`Typed: "${e.target.value}"`)}
        />
      </div>
      <div style={{ width: '100%', textAlign: 'left', fontFamily: 'var(--mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        {log.length === 0 && <div>Event log will appear here…</div>}
        {log.map((entry, i) => (
          <div key={i}>{entry}</div>
        ))}
      </div>
    </>
  );
}

export default function Events() {
  return (
    <article>
      <PageHeader topic={topic}>
        React attaches event handlers with camelCase JSX attributes — pass a function,
        and React calls it with a normalized SyntheticEvent when the interaction happens.
      </PageHeader>

      <CodeBlock
        title="Handling a click"
        code={`function LikeButton() {
  function handleClick() {
    console.log('liked!');
  }

  return <button onClick={handleClick}>Like</button>;
}

// or inline, for handlers that need arguments:
<button onClick={() => handleLike(post.id)}>Like</button>`}
      />

      <h2>Pass a function, don't call it</h2>
      <p>
        <code>onClick={'{handleClick}'}</code> passes the function itself — React calls it
        later, on click. <code>onClick={'{handleClick()}'}</code> calls it immediately
        during render and passes its return value as the handler, which is almost never
        what you want. When you need to pass arguments, wrap it in an arrow function:{' '}
        <code>onClick={'{() => handleLike(id)}'}</code>.
      </p>

      <Callout type="tip" title="SyntheticEvent">
        The <code>e</code> your handler receives isn't the raw browser event — it's
        React's cross-browser wrapper with the same familiar API
        (<code>e.target</code>, <code>e.preventDefault()</code>, …), normalized so your
        code behaves consistently across browsers.
      </Callout>

      <h2>Common event props</h2>
      <ul>
        <li><code>onClick</code>, <code>onDoubleClick</code> — pointer interaction</li>
        <li><code>onChange</code>, <code>onInput</code> — form field value changes</li>
        <li><code>onSubmit</code> — form submission (pair with <code>e.preventDefault()</code>)</li>
        <li><code>onKeyDown</code>, <code>onKeyUp</code> — keyboard interaction</li>
        <li><code>onFocus</code>, <code>onBlur</code> — focus changes, useful for accessibility</li>
      </ul>

      <h2>Try it</h2>
      <DemoCard
        label="Click and type to see events fire"
        code={[
          'function EventDemo() {',
          '  const [log, setLog] = useState([]);',
          '  const push = (msg) => setLog((l) => [msg, ...l].slice(0, 4));',
          '',
          '  return (',
          '    <>',
          "      <button onClick={(e) => push(`Clicked at (${e.clientX}, ${e.clientY})`)}>",
          '        Click me',
          '      </button>',
          '      <input onChange={(e) => push(`Typed: "${e.target.value}"`)} />',
          '      {log.map((entry, i) => <div key={i}>{entry}</div>)}',
          '    </>',
          '  );',
          '}',
        ].join('\n')}
      >
        <EventDemo />
      </DemoCard>

      <h2>What actually happens when you click &ldquo;Click me&rdquo;</h2>
      <StepThrough
        title="Tracing one click of the button"
        steps={[
          {
            icon: '👆',
            label: 'Click',
            explain: 'The browser fires a native click event. React\'s event system catches it and calls your onClick handler with a SyntheticEvent, e.',
            preview: 'onClick(e) invoked',
          },
          {
            icon: '📍',
            label: 'Read e',
            explain: 'The handler reads e.clientX and e.clientY off that event object to build a log message — this has to happen synchronously, while e is still valid.',
            preview: 'msg = "Clicked at (142, 88)"',
          },
          {
            icon: '📜',
            label: 'push(msg)',
            explain: 'push calls setLog with an updater function: [msg, ...l].slice(0, 4) — prepend the new entry, keep only the latest 4.',
            preview: 'log update scheduled',
          },
          {
            icon: '🔁',
            label: 'Re-run',
            explain: 'React re-runs EventDemo. log now includes the new entry at the front.',
            preview: 'log[0] === "Clicked at (142, 88)"',
          },
          {
            icon: '🖥️',
            label: 'Commit',
            explain: 'React updates the DOM: one new line appears at the top of the log, and the oldest line (past 4) is removed.',
            preview: 'log list re-rendered',
          },
        ]}
      />

      <Quiz
        question="Why does the handler read e.clientX before calling setLog, rather than after?"
        options={[
          "It doesn't matter, order is irrelevant",
          "React may reuse/clear the SyntheticEvent object after the handler finishes, so values need to be read synchronously during the handler",
          "setLog always runs before the handler body",
        ]}
        correctIndex={1}
        explanation="event properties should be read (or the event persisted) while the handler is executing — reading them later, e.g. inside an async callback, can see a cleared event object."
      />
      <Quiz
        question="Typing into the input logs a message like Typed: '...' on every keystroke. Which prop makes that happen?"
        options={['onSubmit', 'onChange', 'onFocus']}
        correctIndex={1}
        explanation="onChange fires on every value change to a form field, which is exactly why it's the standard event for tracking what a user is typing, live."
      />

      <RealWorld title="A search box that waits for you to stop typing">
        <p>
          A live search bar can't fire a network request on every single keystroke — it
          would spam the server. Real search boxes handle <code>onChange</code> the same
          way you just saw, but debounce it: reset a timer on every keystroke, and only
          actually search once typing pauses.
        </p>
        <CodeBlock
          title="SearchBox.jsx"
          code={`function SearchBox({ onSearch }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => onSearch(query), 400);
    return () => clearTimeout(timer); // cancel if the user keeps typing
  }, [query, onSearch]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search products…"
    />
  );
}`}
        />
      </RealWorld>

      <Quiz
        question="What's wrong with <button onClick={handleClick()}>?"
        options={[
          'Nothing, this is the correct way to pass a handler',
          'It calls handleClick immediately during render instead of on click',
          'onClick only works on <a> tags, not <button>',
        ]}
        correctIndex={1}
        explanation="the parentheses invoke the function right away, during render — you want to pass the function reference itself (or an arrow function wrapping the call) so React can call it later, on the actual click."
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
