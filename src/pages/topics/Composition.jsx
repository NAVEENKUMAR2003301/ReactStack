import PageHeader from '../../components/PageHeader';
import PageNavFooter from '../../components/PageNavFooter';
import CodeBlock from '../../components/CodeBlock';
import DemoCard from '../../components/DemoCard';
import StepThrough from '../../components/StepThrough';
import Callout from '../../components/Callout';
import RealWorld from '../../components/RealWorld';
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
      <DemoCard
        label="Composable Panel"
        code={`function Panel({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function CompositionDemo() {
  return (
    <Panel title="Order #4821">
      <p>2× Espresso, 1× Croissant</p>
      <button>Mark ready</button>
    </Panel>
  );
}`}
      >
        <CompositionDemo />
      </DemoCard>

      <h2>What actually happens when this mounts</h2>
      <StepThrough
        title="Tracing how children flows into Panel"
        steps={[
          {
            icon: '🔤',
            label: 'JSX written',
            explain: 'CompositionDemo writes <Panel title="Order #4821"> with a <p> and a <button> nested inside it.',
            preview: '<Panel>...</Panel> with nested JSX',
          },
          {
            icon: '📦',
            label: 'children collected',
            explain: 'Before Panel even runs, React collects everything nested between its tags into one value and passes it as props.children.',
            preview: 'props.children = [<p>…</p>, <button>…</button>]',
          },
          {
            icon: '🧩',
            label: 'Panel runs',
            explain: 'Panel executes with { title, children } destructured from props — it has no idea what\'s actually inside children, only that it\'s some JSX to render.',
            preview: 'Panel({ title: "Order #4821", children: [...] })',
          },
          {
            icon: '🌳',
            label: 'Slot filled',
            explain: 'Panel returns its own card chrome (title, border, padding) with {children} dropped in the middle — the caller\'s JSX and Panel\'s JSX merge into one tree.',
            preview: 'card chrome + injected content',
          },
          {
            icon: '🖥️',
            label: 'Paint',
            explain: 'The combined tree is rendered once, as a single component tree — there is no separate "slot-filling" step at runtime.',
            preview: 'card renders with order details inside',
          },
        ]}
      />

      <Quiz
        question="Does Panel need to know that its children happen to be a <p> and a <button>?"
        options={[
          "Yes, Panel must declare exactly which elements it accepts as children",
          "No — Panel only cares that children is some renderable JSX; it never inspects what's inside it",
          "Panel converts children into HTML strings before rendering",
        ]}
        correctIndex={1}
        explanation="that's the entire point of the pattern: Panel stays generic by treating children as an opaque value to render, not something it needs to understand or validate."
      />
      <Quiz
        question="If you wanted a second Panel showing a different order with a 'Cancel' button instead, what would you change?"
        options={[
          "Add new props to Panel like buttonLabel and buttonAction",
          "Nothing about Panel itself — just pass different JSX as its children at the call site",
          "Copy Panel into a new component just for that case",
        ]}
        correctIndex={1}
        explanation="composition means the variation lives at the call site, in what you nest inside <Panel>...</Panel>, not inside Panel's own prop list — which is exactly what keeps Panel reusable without growing new props for every use case."
      />

      <RealWorld title="One Modal, reused for confirmations and forms">
        <p>
          Every app has one <code>Modal</code> component — the overlay, the centering,
          the close button, the escape-key handling — reused for a delete confirmation
          today and a settings form tomorrow, purely by changing what's passed as
          children.
        </p>
        <CodeBlock
          title="Modal.jsx"
          code={`function Modal({ onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}

// same Modal, two completely different uses:
<Modal onClose={close}><DeleteConfirmation /></Modal>
<Modal onClose={close}><SettingsForm /></Modal>`}
        />
      </RealWorld>

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
