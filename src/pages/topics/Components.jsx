import PageHeader from '../../components/PageHeader';
import PageNavFooter from '../../components/PageNavFooter';
import CodeBlock from '../../components/CodeBlock';
import DemoCard from '../../components/DemoCard';
import Callout from '../../components/Callout';
import FlowDiagram from '../../components/FlowDiagram';
import Quiz from '../../components/Quiz';
import { TOPICS } from '../../data/topics';

const topic = TOPICS.find((t) => t.slug === 'components');

function Avatar({ emoji, name }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem' }}>{emoji}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{name}</div>
    </div>
  );
}

function TeamDemo() {
  return (
    <div className="btn-row">
      <Avatar emoji="🦊" name="Fox" />
      <Avatar emoji="🐼" name="Panda" />
      <Avatar emoji="🐧" name="Penguin" />
    </div>
  );
}

export default function Components() {
  return (
    <article>
      <PageHeader topic={topic}>
        A component is a JavaScript function that returns JSX. That's the whole
        definition — everything else is a consequence of that one idea.
      </PageHeader>

      <p>
        Components are how React lets you build a big, complex UI out of small, isolated,
        reusable pieces. A component name must start with a{' '}
        <strong>capital letter</strong> — that's how React tells a custom component
        (<code>&lt;Avatar /&gt;</code>) apart from a built-in HTML tag
        (<code>&lt;div /&gt;</code>).
      </p>

      <CodeBlock
        title="Defining and using a component"
        code={`function Avatar({ emoji, name }) {
  return (
    <div>
      <span>{emoji}</span>
      <p>{name}</p>
    </div>
  );
}

function Team() {
  return (
    <div>
      <Avatar emoji="🦊" name="Fox" />
      <Avatar emoji="🐼" name="Panda" />
    </div>
  );
}`}
      />

      <FlowDiagram
        steps={[
          { icon: '🔤', label: '<Team /> called' },
          { icon: '🧩', label: 'Renders 2× <Avatar />' },
          { icon: '🌳', label: 'Component tree built' },
          { icon: '🖥️', label: 'Painted to screen' },
        ]}
      />

      <h2>Composition over one giant function</h2>
      <p>
        You could write the whole UI as one massive function, but splitting it into
        components buys you three things: each piece is <strong>testable</strong> in
        isolation, <strong>reusable</strong> anywhere, and <strong>readable</strong> —
        the parent component reads like an outline of the page.
      </p>

      <Callout type="why" title="Why capitalization matters">
        JSX compiles <code>&lt;avatar /&gt;</code> (lowercase) to
        <code> React.createElement('avatar', ...)</code> — React treats it as an HTML tag
        named "avatar" and renders nothing useful. Capitalizing it to
        <code> &lt;Avatar /&gt;</code> compiles to
        <code> React.createElement(Avatar, ...)</code>, calling your function instead.
      </Callout>

      <h2>Try it</h2>
      <p>
        <code>Team</code> renders three <code>Avatar</code> components, each with
        different props — the same component, reused three times.
      </p>
      <DemoCard label="Component tree in action">
        <TeamDemo />
      </DemoCard>

      <Quiz
        question="Why does <avatar /> (lowercase) fail to render your component?"
        options={[
          'React only supports uppercase HTML tags',
          'React treats lowercase tags as built-in DOM elements, not your function',
          'JSX requires component names to be exactly 5 letters',
        ]}
        correctIndex={1}
        explanation="capitalization is how JSX decides whether a tag is a native DOM element or a call to your component function."
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
