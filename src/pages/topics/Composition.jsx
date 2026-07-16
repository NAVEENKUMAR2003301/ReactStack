import PageHeader from '../../components/PageHeader';
import PageNavFooter from '../../components/PageNavFooter';
import CodeBlock from '../../components/CodeBlock';
import DemoCard from '../../components/DemoCard';
import Callout from '../../components/Callout';
import Quiz from '../../components/Quiz';
import { TOPICS } from '../../data/topics';

const topic = TOPICS.find((t) => t.slug === 'composition');

function Panel({ title, children }) {
  return (
    <div className="card" style={{ textAlign: 'left', width: '100%', maxWidth: 320 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {children}
    </div>
  );
}

function CompositionDemo() {
  return (
    <Panel title="Order #4821">
      <p style={{ fontSize: '0.85rem' }}>2× Espresso, 1× Croissant</p>
      <div className="btn-row" style={{ justifyContent: 'flex-start' }}>
        <button className="btn btn--sm btn--primary">Mark ready</button>
      </div>
    </Panel>
  );
}

export default function Composition() {
  return (
    <article>
      <PageHeader topic={topic}>
        The children prop lets a component render whatever JSX its caller hands it —
        composition instead of stuffing every option into a giant props list.
      </PageHeader>

      <p>
        Any JSX nested between a component's opening and closing tags is passed to it
        automatically as <code>props.children</code>. That turns a component like{' '}
        <code>Panel</code> into a reusable "slot" — a shell that doesn't need to know
        what's inside it.
      </p>

      <CodeBlock
        title="children in action"
        code={`function Panel({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

// the caller decides what goes inside
<Panel title="Order #4821">
  <p>2× Espresso, 1× Croissant</p>
  <button>Mark ready</button>
</Panel>`}
      />

      <h2>Composition vs. a wall of props</h2>
      <p>
        The alternative would be a <code>Panel</code> that accepts{' '}
        <code>bodyText</code>, <code>showButton</code>, <code>buttonLabel</code>,{' '}
        <code>onButtonClick</code>… every new use case adds another prop, and{' '}
        <code>Panel</code> ends up knowing details about every possible thing that might
        appear inside it. Passing JSX as <code>children</code> keeps <code>Panel</code>{' '}
        generic — it only owns the title and the card chrome, nothing else.
      </p>

      <Callout type="tip" title="This is how layout components work">
        Every reusable "shell" component you've used — a Modal, a Card, a Layout, a Route
        wrapper — is built on this same pattern: render fixed chrome around
        <code>{' {children}'}</code>. It's not a special API, just a prop named{' '}
        <code>children</code> that JSX populates automatically from nested tags.
      </Callout>

      <h2>Try it</h2>
      <p>The card chrome, spacing, and border all live in <code>Panel</code> — only the title prop and the nested content change per use.</p>
      <DemoCard label="Composable Panel">
        <CompositionDemo />
      </DemoCard>

      <Quiz
        question="What is props.children in <Panel title='X'><p>Hi</p></Panel>?"
        options={[
          "An array of Panel's own child components defined internally",
          "The JSX nested between Panel's opening and closing tags — the <p>Hi</p>",
          "A list of all DOM children after rendering",
        ]}
        correctIndex={1}
        explanation="React automatically collects anything nested inside a component's tags into a special prop called children, letting the caller inject arbitrary JSX into the component's layout."
      />

      <PageNavFooter slug={topic.slug} />
    </article>
  );
}
