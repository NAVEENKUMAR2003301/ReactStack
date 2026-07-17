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

const topic = TOPICS.find((t) => t.slug === 'lists-and-keys');

let nextId = 4;

function TodoDemo() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn JSX' },
    { id: 2, text: 'Understand props' },
    { id: 3, text: 'Master lists & keys' },
  ]);
  const [text, setText] = useState('');

  const add = () => {
    if (!text.trim()) return;
    setTodos((t) => [...t, { id: nextId++, text }]);
    setText('');
  };
  const remove = (id) => setTodos((t) => t.filter((todo) => todo.id !== id));

  return (
    <>
      <div className="btn-row">
        <input
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Add a task…"
        />
        <button className="btn btn--primary btn--sm" onClick={add}>Add</button>
      </div>
      <ul style={{ textAlign: 'left', width: '100%', maxWidth: 320 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {todo.text}
            <button className="btn btn--sm" onClick={() => remove(todo.id)} aria-label={`Remove ${todo.text}`}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function ListsAndKeys() {
  return (
    <article>
      <PageHeader topic={topic}>
        Turn an array of data into an array of JSX with .map(), and give each item a
        stable key so React can track it correctly across re-renders.
      </PageHeader>

      <CodeBlock
        title="Rendering a list"
        code={`const todos = [
  { id: 1, text: 'Learn JSX' },
  { id: 2, text: 'Understand props' },
];

<ul>
  {todos.map((todo) => (
    <li key={todo.id}>{todo.text}</li>
  ))}
</ul>`}
      />

      <h2>Why keys exist</h2>
      <p>
        When a list re-renders, React needs to match each new JSX element back to the DOM
        node it already created — otherwise it would tear down and rebuild every item on
        every change. The <code>key</code> prop is that matching identifier: React uses
        it to tell "this is the same item, just moved/updated" apart from "this is a new
        item."
      </p>

      <Callout type="warn" title="Why not use the array index as a key?">
        An index is stable only if the list never reorders, inserts, or removes items
        from the middle. Once it does, index-as-key causes React to match the wrong DOM
        node to the wrong data — component state (like an open text input) can end up
        attached to the wrong row. Use a stable, unique id from your data instead — a
        database id, a UUID, anything that stays with the item, not its position.
      </Callout>

      <h2>Try it</h2>
      <p>
        Each todo has a real <code>id</code> used as its key — add and remove items and
        React keeps every row's identity correct.
      </p>
      <DemoCard
        label="A keyed, dynamic list"
        code={[
          'function TodoDemo() {',
          "  const [todos, setTodos] = useState([{ id: 1, text: 'Learn JSX' }, ...]);",
          "  const [text, setText] = useState('');",
          '',
          '  const add = () => setTodos((t) => [...t, { id: nextId++, text }]);',
          '  const remove = (id) => setTodos((t) => t.filter((todo) => todo.id !== id));',
          '',
          '  return (',
          '    <ul>',
          '      {todos.map((todo) => (',
          '        <li key={todo.id}>',
          '          {todo.text}',
          '          <button onClick={() => remove(todo.id)}>✕</button>',
          '        </li>',
          '      ))}',
          '    </ul>',
          '  );',
          '}',
        ].join('\n')}
      >
        <TodoDemo />
      </DemoCard>

      <h2>What actually happens when you add a task</h2>
      <StepThrough
        title="Tracing one call to add()"
        steps={[
          {
            icon: '⌨️',
            label: 'Add',
            explain: 'You type a task and press Enter (or click Add). add() runs, calling setTodos with a new array: [...t, { id: nextId++, text }].',
            preview: 'todos update scheduled',
          },
          {
            icon: '🆕',
            label: 'New array',
            explain: 'Note this builds a brand new array with the spread operator — it never mutates the old todos array in place.',
            preview: '[...oldTodos, { id: 4, text: "…" }]',
          },
          {
            icon: '🔁',
            label: 'Re-run',
            explain: 'React re-runs TodoDemo. todos.map() runs again over the new, longer array.',
            preview: '4 <li> elements produced, one per todo',
          },
          {
            icon: '🔑',
            label: 'Match by key',
            explain: 'React compares the new list of keys against the old one. The first 3 keys (ids 1, 2, 3) match existing DOM nodes exactly — only the new id is unrecognized.',
            preview: '3 keys matched, 1 new key',
          },
          {
            icon: '🖥️',
            label: 'Commit',
            explain: 'React leaves the first 3 <li> DOM nodes untouched and inserts exactly one new <li> for the new todo.',
            preview: '1 new <li> inserted, 3 untouched',
          },
        ]}
      />

      <Quiz
        question="Why does add() write setTodos((t) => [...t, newTodo]) instead of t.push(newTodo)?"
        options={[
          'push() is slower than spreading an array',
          'push() mutates the existing array in place — React compares old vs. new state by reference, so a mutated array looks unchanged and might not trigger a re-render',
          'There is no real difference, either works identically',
        ]}
        correctIndex={1}
        explanation="React (and the updater-function pattern) expects a new array/object when state changes — mutating the old one in place can cause React to think nothing changed, since it's still the exact same reference."
      />
      <Quiz
        question="If the list used the array index as the key instead of todo.id, what would break after removing the first item?"
        options={[
          'Nothing — indexes work exactly as well as ids',
          "Every remaining row would be re-matched to the wrong index, potentially misattributing any per-row local state (like focus) to the wrong item",
          'The list would stop rendering entirely',
        ]}
        correctIndex={1}
        explanation="removing the first item shifts every other item's index down by one — React would think row 2 is now row 1's data, mismatching identity even though nothing about that row actually changed."
      />

      <RealWorld title="Rendering a blog's post list from an API">
        <p>
          A blog's homepage fetches an array of posts from a server and maps over it
          exactly like the todo list — each post already has a unique database{' '}
          <code>id</code>, which is the natural key. There's no need to invent one.
        </p>
        <CodeBlock
          title="PostList.jsx"
          code={`function PostList({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link to={\`/posts/\${post.id}\`}>{post.title}</Link>
          <span>{post.publishedAt}</span>
        </li>
      ))}
    </ul>
  );
}`}
        />
      </RealWorld>

      <Quiz
        question="You have a list of rows, each with an editable text input, and users can reorder or delete rows. What should the key be?"
        options={[
          'The row\'s index in the array',
          'A stable unique id that belongs to that row\'s data',
          'A random number generated on every render',
        ]}
        correctIndex={1}
        explanation="a stable id keeps each input's local state (like cursor position, or focus) attached to the correct row even as the list reorders — index or random keys both break that guarantee."
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
